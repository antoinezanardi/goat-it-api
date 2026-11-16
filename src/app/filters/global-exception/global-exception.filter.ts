import { ServerResponse } from "node:http";

import { ZodValidationException } from "nestjs-zod";
import {
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
  ServiceUnavailableException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ZodError } from "zod";

import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";
import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";

import { getDerivedErrorCodeFromClassName } from "@shared/infrastructure/http/errors/helpers/errors.helpers";
import { applyNoStoreResponseHeadersToFastifyReply, applyNoStoreResponseHeadersToServerResponse } from "@shared/infrastructure/helpers/response-headers/response-headers.helpers";

import { QuestionAlreadyArchivedError } from "@question/domain/errors/question-already-archived/question-already-archived.error";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";
import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { ReferencedQuestionThemeArchivedError } from "@question/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import type { FastifyReply } from "fastify";

/**
 * Single composition point that turns any thrown value into the HTTP response.
 *
 * Known Fastify body-parser and handler-timeout errors are mapped to curated 400, 413, 415 and 503 envelopes, keyed only on
 * their Fastify error code; Zod validation errors and unrelated `HttpException`s are forwarded as they are; known domain
 * errors are mapped to 404, 400 or 409 through a class-name table; everything else is logged and answered with a 500 that
 * never exposes the original message.
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

  private static sendZodValidationException(exception: ZodValidationException, response: FastifyReply | ServerResponse): void {
    const zodError = exception.getZodError();
    const validationDetails = zodError instanceof ZodError ? zodError.issues : [];
    const badRequestException = new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Invalid request payload",
      error: "Bad Request",
      validationDetails,
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

  /**
   * Writes the response for the first matching branch and never rethrows.
   *
   * A mapped domain error keeps its message and gains an error code derived from its class name; an unknown error is logged and replaced by a generic 500.
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply | ServerResponse>();
    const fastifyErrorHttpException = GlobalExceptionFilter.getFastifyErrorHttpException(exception);

    if (fastifyErrorHttpException) {
      GlobalExceptionFilter.sendNestHttpException(fastifyErrorHttpException, response);

      return;
    }

    if (exception instanceof ZodValidationException) {
      GlobalExceptionFilter.sendZodValidationException(exception, response);

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

    this.sendUnknownException(exception, response);
  }

  private sendUnknownException(exception: unknown, response: FastifyReply | ServerResponse): void {
    const errorMessage = Error.isError(exception) ? exception.message : String(exception);
    this.logger.error(errorMessage);
    const internalServerErrorException = new InternalServerErrorException();

    GlobalExceptionFilter.sendNestHttpException(internalServerErrorException, response);
  }
}