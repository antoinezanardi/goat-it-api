import { ServerResponse } from "node:http";

import { ZodValidationException } from "nestjs-zod";
import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ZodError } from "zod";

import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionAlreadyArchivedError, QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError, QuestionThemeSlugAlreadyExistsError, ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static readonly domainErrorHttpExceptionFactories: Partial<Record<string, (error: Error) => HttpException>> = {
    [QuestionThemeNotFoundError.name]: error => new NotFoundException(error.message),
    [QuestionNotFoundError.name]: error => new NotFoundException(error.message),
    [QuestionThemeAlreadyArchivedError.name]: error => new BadRequestException(error.message),
    [ReferencedQuestionThemeArchivedError.name]: error => new BadRequestException(error.message),
    [QuestionAlreadyArchivedError.name]: error => new BadRequestException(error.message),
    [QuestionThemeSlugAlreadyExistsError.name]: error => new ConflictException(error.message),
    [QuestionThemeAssignmentAlreadyExistsError.name]: error => new ConflictException(error.message),
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
      const httpExceptionFactory = GlobalExceptionFilter.domainErrorHttpExceptionFactories[exception.name];
      if (httpExceptionFactory) {
        GlobalExceptionFilter.sendNestHttpException(httpExceptionFactory(exception), response);

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