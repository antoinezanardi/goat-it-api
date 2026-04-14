import { ServerResponse } from "node:http";

import { BadRequestException, ForbiddenException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

import { GlobalExceptionFilter } from "@shared/infrastructure/http/filters/global-exception/global-exception.filter";

import { QuestionPrimaryThemeAssignmentNotRemovableError, QuestionThemeAssignmentAbsentError, QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionAlreadyArchivedError, QuestionMinimumThemesError, QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError, QuestionThemeReferencedByLiveQuestionsError, QuestionThemeSlugAlreadyExistsError, ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import { createFakeApiResponseExceptionValidationDetailsDto } from "@faketories/shared/infrastructure/http/dto/api-response-exception/api-response-exception.faketory";

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

  describe("sendZodValidationException", () => {
    it("should send BadRequestException status when called.", () => {
      const zodValidationException = new ZodValidationException(new ZodError([
        {
          message: "Validation error message",
          code: "invalid_type",
          expected: "string",
          path: ["field1", "field2"],
        },
      ]));
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as {
        sendNestHttpException: (...parameters: unknown[]) => void;
        sendZodValidationException: (...parameters: unknown[]) => void;
      };
      const sendNestHttpExceptionSpy = vi.spyOn(globalExceptionFilterStub, "sendNestHttpException");
      globalExceptionFilterStub.sendZodValidationException(zodValidationException, mocks.filters.globalException.fastifyReply);
      const expectedException = new BadRequestException({
        statusCode: 400,
        message: "Invalid request payload",
        error: "Bad Request",
        validationDetails: [
          createFakeApiResponseExceptionValidationDetailsDto({
            message: "Validation error message",
            code: "invalid_type",
            expected: "string",
            path: ["field1", "field2"],
          }),
        ],
      });

      expect(sendNestHttpExceptionSpy).toHaveBeenCalledExactlyOnceWith(expectedException, mocks.filters.globalException.fastifyReply);
    });

    it("should send empty validationDetails when called with ZodValidationException with no issues.", () => {
      const zodValidationException = new ZodValidationException(new ZodError([]));
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as {
        sendNestHttpException: (...parameters: unknown[]) => void;
        sendZodValidationException: (...parameters: unknown[]) => void;
      };
      const sendNestHttpExceptionSpy = vi.spyOn(globalExceptionFilterStub, "sendNestHttpException");
      globalExceptionFilterStub.sendZodValidationException(zodValidationException, mocks.filters.globalException.fastifyReply);
      const expectedException = new BadRequestException({
        statusCode: 400,
        message: "Invalid request payload",
        error: "Bad Request",
        validationDetails: [],
      });

      expect(sendNestHttpExceptionSpy).toHaveBeenCalledExactlyOnceWith(expectedException, mocks.filters.globalException.fastifyReply);
    });

    it("should send empty validationDetails when called with ZodValidationException with non-ZodError.", () => {
      const zodValidationException = new ZodValidationException(new Error("Some other error"));
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as {
        sendNestHttpException: (...parameters: unknown[]) => void;
        sendZodValidationException: (...parameters: unknown[]) => void;
      };
      const sendNestHttpExceptionSpy = vi.spyOn(globalExceptionFilterStub, "sendNestHttpException");
      globalExceptionFilterStub.sendZodValidationException(zodValidationException, mocks.filters.globalException.fastifyReply);
      const expectedException = new BadRequestException({
        statusCode: 400,
        message: "Invalid request payload",
        error: "Bad Request",
        validationDetails: [],
      });

      expect(sendNestHttpExceptionSpy).toHaveBeenCalledExactlyOnceWith(expectedException, mocks.filters.globalException.fastifyReply);
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
        test: "should send zod validation exception mapped to bad request when called with ZodValidationException.",
        exception: new ZodValidationException(new ZodError([
          {
            message: "Invalid type",
            code: "invalid_type",
            expected: "string",
            path: ["field1", "field2"],
          },
        ])),
        expectedSentException: new BadRequestException({
          statusCode: 400,
          message: "Invalid request payload",
          error: "Bad Request",
          validationDetails: [
            createFakeApiResponseExceptionValidationDetailsDto({
              message: "Invalid type",
              code: "invalid_type",
              expected: "string",
              path: ["field1", "field2"],
            }),
          ],
        }),
      },
      {
        test: "should send directly nest http exception when called with HttpException.",
        exception: new ForbiddenException("Access denied"),
        expectedSentException: new ForbiddenException("Access denied"),
      },
      {
        test: "should map domain error to http exception and send it when called with known QuestionThemeNotFoundError.",
        exception: new QuestionThemeNotFoundError("question-theme-id"),
        expectedSentException: new HttpException({
          error: "Not Found",
          statusCode: HttpStatus.NOT_FOUND,
          message: "Question theme with id question-theme-id not found",
          errorCode: "question-theme-not-found",
        }, HttpStatus.NOT_FOUND),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionNotFoundError.",
        exception: new QuestionNotFoundError("question-id"),
        expectedSentException: new HttpException({
          error: "Not Found",
          statusCode: HttpStatus.NOT_FOUND,
          message: "Question with id question-id not found",
          errorCode: "question-not-found",
        }, HttpStatus.NOT_FOUND),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionThemeAssignmentAbsentError.",
        exception: new QuestionThemeAssignmentAbsentError("question-theme-id", "question-id"),
        expectedSentException: new HttpException({
          error: "Not Found",
          statusCode: HttpStatus.NOT_FOUND,
          message: "Question theme with id question-theme-id is not assigned to question with id question-id",
          errorCode: "question-theme-assignment-absent",
        }, HttpStatus.NOT_FOUND),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionThemeAlreadyArchivedError.",
        exception: new QuestionThemeAlreadyArchivedError("question-theme-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Question theme with id question-theme-id already has status 'archived'",
          errorCode: "question-theme-already-archived",
        }, HttpStatus.BAD_REQUEST),
      },
      {
        test: "should map domain error to http exception and send it when called with ReferencedQuestionThemeArchivedError.",
        exception: new ReferencedQuestionThemeArchivedError("question-theme-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Referenced question theme with id question-theme-id is archived",
          errorCode: "referenced-question-theme-archived",
        }, HttpStatus.BAD_REQUEST),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionAlreadyArchivedError.",
        exception: new QuestionAlreadyArchivedError("question-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Question with id question-id already has status 'archived'",
          errorCode: "question-already-archived",
        }, HttpStatus.BAD_REQUEST),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionMinimumThemesError.",
        exception: new QuestionMinimumThemesError("question-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Question with id question-id must have at least 1 theme assigned",
          errorCode: "question-minimum-themes",
        }, HttpStatus.BAD_REQUEST),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionPrimaryThemeAssignmentNotRemovableError.",
        exception: new QuestionPrimaryThemeAssignmentNotRemovableError("question-theme-id", "question-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Primary question theme with id question-theme-id cannot be removed from question with id question-id. Switch primary to another theme first",
          errorCode: "question-primary-theme-assignment-not-removable",
        }, HttpStatus.BAD_REQUEST),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionThemeSlugAlreadyExistsError.",
        exception: new QuestionThemeSlugAlreadyExistsError("question-theme-slug"),
        expectedSentException: new HttpException({
          error: "Conflict",
          statusCode: HttpStatus.CONFLICT,
          message: "Question theme with slug question-theme-slug already exists",
          errorCode: "question-theme-slug-already-exists",
        }, HttpStatus.CONFLICT),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionThemeAssignmentAlreadyExistsError.",
        exception: new QuestionThemeAssignmentAlreadyExistsError("question-theme-id", "question-id"),
        expectedSentException: new HttpException({
          error: "Conflict",
          statusCode: HttpStatus.CONFLICT,
          message: "Question theme assignment with id question-theme-id already exists in question with id question-id",
          errorCode: "question-theme-assignment-already-exists",
        }, HttpStatus.CONFLICT),
      },
      {
        test: "should map domain error to http exception and send it when called with QuestionThemeReferencedByLiveQuestionsError.",
        exception: new QuestionThemeReferencedByLiveQuestionsError("question-theme-id", 5),
        expectedSentException: new HttpException({
          error: "Conflict",
          statusCode: HttpStatus.CONFLICT,
          message: "Question theme with id question-theme-id is referenced by 5 live question(s) and cannot be archived",
          errorCode: "question-theme-referenced-by-live-questions",
        }, HttpStatus.CONFLICT),
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