import { ServerResponse } from "node:http";

import { ZodValidationException } from "nestjs-zod";
import { FastifyReply } from "fastify";
import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ZodError } from "zod";

import { getDerivedErrorCodeFromClassName } from "@shared/infrastructure/http/errors/helpers/errors.helpers";

import { QuestionAlreadyArchivedError, QuestionMinimumThemesError, QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QuestionPrimaryThemeAssignmentNotRemovableError, QuestionThemeAssignmentAbsentError, QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError, QuestionThemeSlugAlreadyExistsError, ReferencedQuestionThemeArchivedError, QuestionThemeReferencedByLiveQuestionsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static readonly domainErrorHttpExceptionFactories: Partial<Record<string, new () => HttpException>> = {
    [QuestionThemeNotFoundError.name]: NotFoundException,
    [QuestionNotFoundError.name]: NotFoundException,
    [QuestionThemeAssignmentAbsentError.name]: NotFoundException,
    [QuestionThemeAlreadyArchivedError.name]: BadRequestException,
    [ReferencedQuestionThemeArchivedError.name]: BadRequestException,
    [QuestionAlreadyArchivedError.name]: BadRequestException,
    [QuestionMinimumThemesError.name]: BadRequestException,
    [QuestionPrimaryThemeAssignmentNotRemovableError.name]: BadRequestException,
    [QuestionThemeSlugAlreadyExistsError.name]: ConflictException,
    [QuestionThemeAssignmentAlreadyExistsError.name]: ConflictException,
    [QuestionThemeReferencedByLiveQuestionsError.name]: ConflictException,
  };

  private readonly logger = new Logger(GlobalExceptionFilter.name);

  private static sendNestHttpException(exception: HttpException, response: FastifyReply | ServerResponse): void {
    if (response instanceof ServerResponse) {
      response.writeHead(exception.getStatus(), { "Content-Type": "application/json" });
      response.end(JSON.stringify(exception.getResponse()));

      return;
    }
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

    GlobalExceptionFilter.sendNestHttpException(badRequestException, response);
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply | ServerResponse>();

    if (exception instanceof ZodValidationException) {
      GlobalExceptionFilter.sendZodValidationException(exception, response);

      return;
    }

    if (exception instanceof HttpException) {
      GlobalExceptionFilter.sendNestHttpException(exception, response);

      return;
    }

    if (exception instanceof Error) {
      const DomainHttpExceptionFactory = GlobalExceptionFilter.domainErrorHttpExceptionFactories[exception.name];
      if (DomainHttpExceptionFactory) {
        const domainHttpException = new DomainHttpExceptionFactory();
        const statusCode = domainHttpException.getStatus();
        const httpException = new HttpException({
          error: domainHttpException.message,
          message: exception.message,
          statusCode,
          errorCode: getDerivedErrorCodeFromClassName(exception.constructor.name),
        }, statusCode);

        GlobalExceptionFilter.sendNestHttpException(httpException, response);

        return;
      }
    }

    this.sendUnknownException(exception, response);
  }

  private sendUnknownException(exception: unknown, response: FastifyReply | ServerResponse): void {
    const errorMessage = exception instanceof Error ? exception.message : String(exception);
    this.logger.error(errorMessage);
    const internalServerErrorException = new InternalServerErrorException();

    GlobalExceptionFilter.sendNestHttpException(internalServerErrorException, response);
  }
}