import { ServerResponse } from "node:http";

import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { GlobalExceptionFilter } from "@shared/infrastructure/http/filters/global-exception/global-exception.filter";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import type { HttpException } from "@nestjs/common";
import type { FastifyReply } from "fastify";

describe("Global Exception Filter", () => {
  let mocks: {
    filters: {
      globalException: {
        fastifyReply: FastifyReply;
        serverResponse: ServerResponse;
      };
    };
  };

  beforeEach(() => {
    mocks = {
      filters: {
        globalException: {
          fastifyReply: {
            status: vi.fn<(status: number) => FastifyReply>().mockReturnThis(),
            send: vi.fn<() => void>(),
          } as unknown as FastifyReply,
          serverResponse: Object.assign(Object.create(ServerResponse.prototype), {
            writeHead: vi.fn<() => void>(),
            end: vi.fn<() => void>(),
          }) as unknown as ServerResponse,
        },
      },
    };
  });

  describe("sendNestHttpException", () => {
    it("should send the correct status using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      globalExceptionFilterStub.sendNestHttpException(exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.status).toHaveBeenCalledWith(exception.getStatus());
    });

    it("should send the correct response using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      globalExceptionFilterStub.sendNestHttpException(exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.send).toHaveBeenCalledWith(exception.getResponse());
    });

    it("should write the correct head using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      globalExceptionFilterStub.sendNestHttpException(exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.writeHead).toHaveBeenCalledWith(exception.getStatus(), { "Content-Type": "application/json" });
    });

    it("should end the response with the correct response using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      globalExceptionFilterStub.sendNestHttpException(exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.end).toHaveBeenCalledWith(JSON.stringify(exception.getResponse()));
    });
  });

  describe(GlobalExceptionFilter.prototype.catch, () => {
    let localMocks: {
      filters: {
        globalException: {
          host: Parameters<GlobalExceptionFilter["catch"]>[1];
        };
      };
    };

    beforeEach(() => {
      localMocks = {
        filters: {
          globalException: {
            host: {
              switchToHttp: (): { getResponse: () => FastifyReply } => ({
                getResponse: (): FastifyReply => mocks.filters.globalException.fastifyReply,
              }),
            } as unknown as Parameters<GlobalExceptionFilter["catch"]>[1],
          },
        },
      };
    });

    it.each<{
      test: string;
      exception: unknown;
      expectedSentException: HttpException;
    }>([
      {
        test: "should send directly nest http exception when called with HttpException.",
        exception: new ForbiddenException("Access denied"),
        expectedSentException: new ForbiddenException("Access denied"),
      },
      {
        test: "should map domain error to http exception and send it when called with known Error.",
        exception: new QuestionThemeNotFoundError("question-theme-id"),
        expectedSentException: new NotFoundException("Question theme with id question-theme-id not found"),
      },
      {
        test: "should send unknown exception as internal server error when called with unknown exception.",
        exception: "Some unknown exception",
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send unknown exception as internal server error when called with unknown Error.",
        exception: new Error("Some unknown error"),
        expectedSentException: new InternalServerErrorException(),
      },
    ])("$test", ({ exception, expectedSentException }) => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      const sendNestHttpExceptionSpy = vi.spyOn(globalExceptionFilterStub, "sendNestHttpException");

      // oxlint-disable-next-line valid-params prefer-await-to-then
      globalExceptionFilter.catch(exception, localMocks.filters.globalException.host);

      expect(sendNestHttpExceptionSpy).toHaveBeenCalledExactlyOnceWith(expectedSentException, mocks.filters.globalException.fastifyReply);
    });
  });

  describe("sendUnknownException", () => {
    it("should log the error message when called with an Error.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();
      const error = new Error("Unknown error occurred");

      globalExceptionFilter["sendUnknownException"](error, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).toHaveBeenCalledExactlyOnceWith("Unknown error occurred");
    });

    it("should log the string representation when called with a non-Error.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();
      const nonError = "Some unknown exception";

      globalExceptionFilter["sendUnknownException"](nonError, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).toHaveBeenCalledExactlyOnceWith("Some unknown exception");
    });

    it("should send InternalServerErrorException status code using FastifyReply when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const error = new Error("Unknown error occurred");

      globalExceptionFilter["sendUnknownException"](error, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.status).toHaveBeenCalledExactlyOnceWith(500);
    });

    it("should send InternalServerErrorException response using FastifyReply when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const error = new Error("Unknown error occurred");
      const expectedResponse = new InternalServerErrorException().getResponse();

      globalExceptionFilter["sendUnknownException"](error, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.send).toHaveBeenCalledExactlyOnceWith(expectedResponse);
    });
  });
});