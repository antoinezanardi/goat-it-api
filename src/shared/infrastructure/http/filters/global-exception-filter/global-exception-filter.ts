import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static sendNestHttpException(exception: HttpException, response: FastifyReply): void {
    response.status(exception.getStatus()).send(exception.getResponse());
  }

  private static sendUnknownException(exception: unknown, response: FastifyReply): void {
    const errorMessage = exception instanceof Error ? exception.message : String(exception);
    const internalServerErrorException = new InternalServerErrorException(errorMessage);

    GlobalExceptionFilter.sendNestHttpException(internalServerErrorException, response);
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      GlobalExceptionFilter.sendNestHttpException(exception, response);

      return;
    }

    if (exception instanceof Error) {
      const exceptions: Partial<Record<string, HttpException>> = {
        [QuestionThemeNotFoundError.name]: new NotFoundException(exception.message),
      };
      const mappedException = exceptions[exception.name];
      if (mappedException) {
        GlobalExceptionFilter.sendNestHttpException(mappedException, response);
      }
    }

    GlobalExceptionFilter.sendUnknownException(exception, response);
  }
}