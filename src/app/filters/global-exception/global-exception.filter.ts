import { ServerResponse } from "node:http";

import { ZodSerializationException, ZodValidationException } from "nestjs-zod";
import {
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
  ServiceUnavailableException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ZodError } from "zod";

import { captureServerError } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers";

import { GENERIC_INTERNAL_SERVER_ERROR_BODY, NON_ERROR_THROWN, SENTRY_CAPTURE_FAILED_LOG_MESSAGE, UNKNOWN_SENTRY_CONTEXT_VALUE } from "@app/filters/global-exception/constants/global-exception.constants";
import { getErrorStackFrames } from "@app/filters/global-exception/helpers/error-stack/error-stack.helpers";

import { getDerivedErrorCodeFromClassName } from "@shared/infrastructure/http/errors/helpers/errors.helpers";
import { applyNoStoreResponseHeadersToFastifyReply, applyNoStoreResponseHeadersToServerResponse } from "@shared/infrastructure/helpers/response-headers/response-headers.helpers";
import { getSecurityEventRoute, logRequestErrorEvent, logRequestValidationFailedEvent } from "@shared/infrastructure/helpers/security-events/security-events.helpers";

import { QuestionAlreadyArchivedError } from "@question/domain/errors/question-already-archived/question-already-archived.error";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";
import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { ReferencedQuestionThemeArchivedError } from "@question/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";

import type { ArgumentsHost, ExceptionFilter, LoggerService } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import type { SentryReportableRequest } from "@app/filters/global-exception/global-exception.filter.types";

/**
 * Single composition point that turns any thrown value into the HTTP response.
 *
 * Known Fastify body-parser and handler-timeout errors are mapped to curated 400, 413, 415 and 503 envelopes, keyed only on
 * their Fastify error code; Zod validation errors and unrelated `HttpException`s are forwarded as they are; a response
 * serialization failure is reported and answered with the generic 500; known domain errors are mapped to 404, 400 or 409
 * through a class-name table; everything else is reported to the error tracker, emitted as a structured `request.error`
 * event with a frames-only stack and answered with a 500 that never exposes the original message.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static readonly domainErrorHttpExceptionFactories: Partial<Record<string, new () => HttpException>> = {
    [QuestionThemeNotFoundError.name]: NotFoundException,
    [QuestionNotFoundError.name]: NotFoundException,
    [QuestionThemeAssignmentAbsentError.name]: NotFoundException,
    [QuestionThemeAlreadyArchivedError.name]: BadRequestException,
    [ReferencedQuestionThemeArchivedError.name]: BadRequestException,
    [QuestionAlreadyArchivedError.name]: BadRequestException,
    [QuestionMaximumThemesError.name]: BadRequestException,
    [QuestionMinimumThemesError.name]: BadRequestException,
    [QuestionPrimaryThemeAssignmentNotRemovableError.name]: BadRequestException,
    [QuestionThemeSlugAlreadyExistsError.name]: ConflictException,
    [QuestionThemeAssignmentAlreadyExistsError.name]: ConflictException,
    [QuestionThemeReferencedByLiveQuestionsError.name]: ConflictException,
  };

  private static readonly fastifyErrorHttpExceptionFactories: Partial<Record<string, () => HttpException>> = {
    FST_ERR_CTP_EMPTY_JSON_BODY: (): HttpException => new BadRequestException("Invalid request body"),
    FST_ERR_CTP_INVALID_JSON_BODY: (): HttpException => new BadRequestException("Invalid request body"),
    FST_ERR_CTP_INVALID_CONTENT_LENGTH: (): HttpException => new BadRequestException("Invalid request body"),
    FST_ERR_CTP_BODY_TOO_LARGE: (): HttpException => new PayloadTooLargeException("Request body is too large"),
    FST_ERR_CTP_INVALID_MEDIA_TYPE: (): HttpException => new UnsupportedMediaTypeException("Unsupported Media Type"),
    FST_ERR_HANDLER_TIMEOUT: (): HttpException => new ServiceUnavailableException("Request timed out"),
  };

  private readonly logger = new Logger(GlobalExceptionFilter.name);

  private static sendNestHttpException(exception: HttpException, response: FastifyReply | ServerResponse): void {
    if (response instanceof ServerResponse) {
      applyNoStoreResponseHeadersToServerResponse(response);
      response.writeHead(exception.getStatus(), { "Content-Type": "application/json" });
      response.end(JSON.stringify(exception.getResponse()));

      return;
    }
    applyNoStoreResponseHeadersToFastifyReply(response);
    response.status(exception.getStatus()).send(exception.getResponse());
  }

  private static sendZodValidationException(
    exception: ZodValidationException,
    response: FastifyReply | ServerResponse,
    logger: LoggerService,
    request: SentryReportableRequest,
  ): void {
    const zodError = exception.getZodError();
    const validationDetails = zodError instanceof ZodError ? zodError.issues : [];
    const badRequestException = new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Invalid request payload",
      error: "Bad Request",
      validationDetails,
    });

    logRequestValidationFailedEvent(logger, {
      route: getSecurityEventRoute(request),
      issueCount: validationDetails.length,
    });

    this.sendNestHttpException(badRequestException, response);
  }

  private static getFastifyErrorCode(exception: unknown): string | undefined {
    const candidate = exception instanceof HttpException ? exception.cause : exception;
    // Acceptable as Fastify creates its errors with Object.create(Error.prototype), so Error.isError returns false for them while instanceof Error is true
    // eslint-disable-next-line unicorn/prefer-error-is-error
    if (candidate instanceof Error && "code" in candidate && typeof candidate.code === "string") {
      return candidate.code;
    }
    return undefined;
  }

  private static getFastifyErrorHttpException(exception: unknown): HttpException | undefined {
    const fastifyErrorCode = this.getFastifyErrorCode(exception);
    if (fastifyErrorCode === undefined) {
      return undefined;
    }
    return this.fastifyErrorHttpExceptionFactories[fastifyErrorCode]?.();
  }

  private static getDomainErrorHttpException(exception: unknown): HttpException | undefined {
    if (!Error.isError(exception)) {
      return undefined;
    }

    const DomainHttpExceptionFactory = this.domainErrorHttpExceptionFactories[exception.name];
    if (!DomainHttpExceptionFactory) {
      return undefined;
    }

    const domainHttpException = new DomainHttpExceptionFactory();
    const statusCode = domainHttpException.getStatus();

    return new HttpException({
      error: domainHttpException.message,
      message: exception.message,
      statusCode,
      errorCode: getDerivedErrorCodeFromClassName(exception.constructor.name),
    }, statusCode);
  }

  private static getSentryContextValue(value: string | undefined): string {
    if (value === undefined) {
      return UNKNOWN_SENTRY_CONTEXT_VALUE;
    }
    return value;
  }

  /**
   * Writes the response for the first matching branch and never rethrows.
   *
   * A Zod validation failure emits `request.validation.failed`; a mapped domain error keeps its message and gains an
   * error code derived from its class name; a response serialization failure or an unknown error is reported to the
   * error tracker, emitted as a structured `request.error` event with a frames-only stack and replaced by a generic 500.
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const httpArgumentsHost = host.switchToHttp();
    const response = httpArgumentsHost.getResponse<FastifyReply | ServerResponse>();
    const request = httpArgumentsHost.getRequest<SentryReportableRequest>();
    const fastifyErrorHttpException = GlobalExceptionFilter.getFastifyErrorHttpException(exception);

    if (fastifyErrorHttpException) {
      GlobalExceptionFilter.sendNestHttpException(fastifyErrorHttpException, response);

      return;
    }

    if (exception instanceof ZodValidationException) {
      GlobalExceptionFilter.sendZodValidationException(exception, response, this.logger, request);

      return;
    }

    if (exception instanceof ZodSerializationException) {
      this.sendUnknownException(exception, request, response);

      return;
    }

    if (exception instanceof HttpException) {
      GlobalExceptionFilter.sendNestHttpException(exception, response);

      return;
    }

    const domainErrorHttpException = GlobalExceptionFilter.getDomainErrorHttpException(exception);

    if (domainErrorHttpException) {
      GlobalExceptionFilter.sendNestHttpException(domainErrorHttpException, response);

      return;
    }

    this.sendUnknownException(exception, request, response);
  }

  private sendUnknownException(exception: unknown, request: SentryReportableRequest, response: FastifyReply | ServerResponse): void {
    const errorInstance = Error.isError(exception) ? exception : undefined;
    const errorClass = errorInstance ? errorInstance.constructor.name : NON_ERROR_THROWN;
    const stack = errorInstance ? getErrorStackFrames(errorInstance) : undefined;
    logRequestErrorEvent(this.logger, {
      route: getSecurityEventRoute(request),
      errorClass,
      stack,
    });
    const sentryErrorContext = {
      errorClass,
      route: GlobalExceptionFilter.getSentryContextValue(request.routeOptions?.url),
      method: GlobalExceptionFilter.getSentryContextValue(request.method),
    };

    try {
      captureServerError(exception, sentryErrorContext);
    } catch {
      this.logger.error(SENTRY_CAPTURE_FAILED_LOG_MESSAGE);
    }

    const internalServerErrorException = new HttpException(GENERIC_INTERNAL_SERVER_ERROR_BODY, HttpStatus.INTERNAL_SERVER_ERROR);

    GlobalExceptionFilter.sendNestHttpException(internalServerErrorException, response);
  }
}