import { ServerResponse } from "node:http";

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static readonly domainErrorHttpExceptionFactories: Partial<Record<string, (error: Error) => HttpException>> = {
    [QuestionThemeNotFoundError.name]: error => new NotFoundException(error.message),
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

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply | ServerResponse>();

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