import { ServerResponse } from "node:http";

import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  PayloadTooLargeException,
  ServiceUnavailableException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";
import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";

import * as sentryHelpers from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers";

import { GlobalExceptionFilter } from "@app/filters/global-exception/global-exception.filter";

import { QuestionAlreadyArchivedError } from "@question/domain/errors/question-already-archived/question-already-archived.error";
import { QuestionCreationError } from "@question/domain/errors/question-creation/question-creation.error";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";
import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment-creation/question-theme-assignment-creation.error";
import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment-modification/question-theme-assignment-modification.error";
import { QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment-removal/question-theme-assignment-removal.error";
import { ReferencedQuestionThemeArchivedError } from "@question/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import { createFakeApiResponseExceptionValidationDetailsDto } from "@faketories/shared/application/dto/api-response-exception/api-response-exception.faketory";

import type { FastifyReply } from "fastify";

import type { SentryReportableRequest } from "@app/filters/global-exception/global-exception.filter.types";

describe(GlobalExceptionFilter, () => {
  let mocks: {
    filters: {
      globalException: {
        fastifyReply: FastifyReply;
        serverResponse: ServerResponse;
        request: SentryReportableRequest;
      };
    };
  };

  beforeEach(() => {
    vi.spyOn(sentryHelpers, "captureServerError").mockReturnValue(undefined);
    mocks = {
      filters: {
        globalException: {
          fastifyReply: {
            status: vi.fn<(status: number) => FastifyReply>().mockReturnThis(),
            send: vi.fn<() => void>(),
            getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
            header: vi.fn<(name: string, value: string) => void>(),
          } as unknown as FastifyReply,
          request: {
            method: "POST",
            routeOptions: { url: "/admin/questions" },
          },
          // Acceptable as we are creating a mock ServerResponse object for testing purposes. The type assertion is necessary to satisfy TypeScript's type checking, as we are creating an object that mimics the ServerResponse interface but does not fully implement it.
          // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
          serverResponse: Object.assign(Object.create(ServerResponse.prototype), {
            writeHead: vi.fn<() => void>(),
            end: vi.fn<() => void>(),
            getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
            setHeader: vi.fn<(name: string, value: string) => void>(),
          }) as unknown as ServerResponse,
        },
      },
    };
  });

  // Acceptable as private static method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(GlobalExceptionFilter["sendNestHttpException"], () => {
    it("should send the correct status using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.status).toHaveBeenCalledExactlyOnceWith(exception.getStatus());
    });

    it("should send the correct response using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.send).toHaveBeenCalledExactlyOnceWith(exception.getResponse());
    });

    it("should write the correct head using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.writeHead).toHaveBeenCalledWith(exception.getStatus(), { "Content-Type": "application/json" });
    });

    it("should end the response with the correct response using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.end).toHaveBeenCalledWith(JSON.stringify(exception.getResponse()));
    });

    it("should set the no-store cache control header using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.header).toHaveBeenCalledWith("Cache-Control", "no-store");
    });

    it("should set the accept language vary header using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.header).toHaveBeenCalledWith("Vary", "Accept-Language");
    });

    it("should merge an existing vary header using the FastifyReply when called.", () => {
      const exception = new NotFoundException("Resource not found");
      vi.mocked(mocks.filters.globalException.fastifyReply.getHeader).mockReturnValue("Origin");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.header).toHaveBeenCalledWith("Vary", "Origin, Accept-Language");
    });

    it("should set the no-store cache control header using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    });

    it("should set the accept language vary header using the ServerResponse when called.", () => {
      const exception = new NotFoundException("Resource not found");
      GlobalExceptionFilter["sendNestHttpException"](exception, mocks.filters.globalException.serverResponse);

      expect(mocks.filters.globalException.serverResponse.setHeader).toHaveBeenCalledWith("Vary", "Accept-Language");
    });
  });

  // Acceptable as private static method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(GlobalExceptionFilter["sendZodValidationException"], () => {
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
              switchToHttp: (): { getRequest: () => SentryReportableRequest; getResponse: () => FastifyReply } => ({
                getRequest: (): SentryReportableRequest => mocks.filters.globalException.request,
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
        test: "should map domain error to http exception and send it when called with QuestionMaximumThemesError.",
        exception: new QuestionMaximumThemesError("question-id"),
        expectedSentException: new HttpException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Question with id question-id cannot have more than 3 themes assigned",
          errorCode: "question-maximum-themes",
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
        test: "should send QuestionCreationError as internal server error when called.",
        exception: new QuestionCreationError(),
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send QuestionThemeAssignmentCreationError as internal server error when called.",
        exception: new QuestionThemeAssignmentCreationError("question-theme-id", "question-id"),
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send QuestionThemeAssignmentModificationError as internal server error when called.",
        exception: new QuestionThemeAssignmentModificationError("question-theme-id", "question-id"),
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send QuestionThemeAssignmentRemovalError as internal server error when called.",
        exception: new QuestionThemeAssignmentRemovalError("question-theme-id", "question-id"),
        expectedSentException: new InternalServerErrorException(),
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
      {
        test: "should map a Fastify empty JSON body error to the curated bad request envelope when called.",
        exception: new HttpException("Body cannot be empty when content-type is set to 'application/json'", HttpStatus.BAD_REQUEST, {
          cause: Object.assign(Object.create(Error.prototype) as Error, {
            code: "FST_ERR_CTP_EMPTY_JSON_BODY",
            name: "FastifyError",
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Body cannot be empty when content-type is set to 'application/json'",
          }),
        }),
        expectedSentException: new BadRequestException("Invalid request body"),
      },
      {
        test: "should map a Fastify malformed JSON body error to the curated bad request envelope when called.",
        exception: new HttpException("Body is not valid JSON but content-type is set to 'application/json'", HttpStatus.BAD_REQUEST, {
          cause: Object.assign(Object.create(Error.prototype) as Error, {
            code: "FST_ERR_CTP_INVALID_JSON_BODY",
            name: "FastifyError",
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Body is not valid JSON but content-type is set to 'application/json'",
          }),
        }),
        expectedSentException: new BadRequestException("Invalid request body"),
      },
      {
        test: "should map a Fastify content length mismatch error to the curated bad request envelope when called.",
        exception: new HttpException("Request body size did not match Content-Length", HttpStatus.BAD_REQUEST, {
          cause: Object.assign(Object.create(Error.prototype) as Error, {
            code: "FST_ERR_CTP_INVALID_CONTENT_LENGTH",
            name: "FastifyError",
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Request body size did not match Content-Length",
          }),
        }),
        expectedSentException: new BadRequestException("Invalid request body"),
      },
      {
        test: "should map a Fastify oversized body error to the curated payload too large envelope when called.",
        exception: new HttpException("Request body is too large", HttpStatus.PAYLOAD_TOO_LARGE, {
          cause: Object.assign(Object.create(Error.prototype) as Error, {
            code: "FST_ERR_CTP_BODY_TOO_LARGE",
            name: "FastifyError",
            statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
            message: "Request body is too large",
          }),
        }),
        expectedSentException: new PayloadTooLargeException("Request body is too large"),
      },
      {
        test: "should map a Fastify unsupported media type error to the curated unsupported media type envelope when called.",
        exception: new HttpException("Unsupported Media Type", HttpStatus.UNSUPPORTED_MEDIA_TYPE, {
          cause: Object.assign(Object.create(Error.prototype) as Error, {
            code: "FST_ERR_CTP_INVALID_MEDIA_TYPE",
            name: "FastifyError",
            statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            message: "Unsupported Media Type",
          }),
        }),
        expectedSentException: new UnsupportedMediaTypeException("Unsupported Media Type"),
      },
      {
        test: "should map a Fastify handler timeout to the sanitized service unavailable envelope when called.",
        exception: Object.assign(Object.create(Error.prototype) as Error, {
          code: "FST_ERR_HANDLER_TIMEOUT",
          name: "FastifyError",
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: "Request timed out after 15000 ms on route '/questions/search/random'",
        }),
        expectedSentException: new ServiceUnavailableException("Request timed out"),
      },
      {
        test: "should send unknown exception as internal server error when called with an Error carrying an unmapped error code.",
        exception: Object.assign(new Error("connection 1 to 127.0.0.1:27017 timed out"), {
          // Acceptable as this row models a MongoDB socket timeout error without importing MongoDB
          // eslint-disable-next-line unicorn/no-error-property-assignment
          name: "MongoNetworkTimeoutError",
          code: "ETIMEDOUT",
        }),
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send unknown exception as internal server error when called with an Error carrying a non-string error code.",
        exception: Object.assign(new Error("write EPIPE"), {
          code: 42,
        }),
        expectedSentException: new InternalServerErrorException(),
      },
      {
        test: "should send unknown exception as internal server error when called with a plain object carrying a Fastify error code.",
        exception: { code: "FST_ERR_CTP_BODY_TOO_LARGE" },
        expectedSentException: new InternalServerErrorException(),
      },
    ])("$test", ({ exception, expectedSentException }) => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const globalExceptionFilterStub = GlobalExceptionFilter as unknown as { sendNestHttpException: (...parameters: unknown[]) => void };
      const sendNestHttpExceptionSpy = vi.spyOn(globalExceptionFilterStub, "sendNestHttpException");

      globalExceptionFilter.catch(exception, localMocks.filters.globalException.host);

      expect(sendNestHttpExceptionSpy).toHaveBeenCalledExactlyOnceWith(expectedSentException, mocks.filters.globalException.fastifyReply);
    });

    it.each<{ test: string; exception: unknown }>([
      {
        test: "should not report a mapped domain error when called with a known domain error.",
        exception: new QuestionThemeNotFoundError("question-theme-id"),
      },
      {
        test: "should not report an explicit http exception when called with HttpException.",
        exception: new ForbiddenException("Access denied"),
      },
      {
        test: "should not report a validation exception when called with ZodValidationException.",
        exception: new ZodValidationException(new ZodError([])),
      },
    ])("$test", ({ exception }) => {
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter.catch(exception, localMocks.filters.globalException.host);

      expect(sentryHelpers.captureServerError).not.toHaveBeenCalled();
    });

    it("should report an unknown error once with its class and route context when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter.catch(new Error("Some unknown error"), localMocks.filters.globalException.host);

      expect(sentryHelpers.captureServerError).toHaveBeenCalledExactlyOnceWith(expect.any(Error), {
        errorClass: "Error",
        route: "/admin/questions",
        method: "POST",
      });
    });
  });

  // Acceptable as private method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(GlobalExceptionFilter.prototype["sendUnknownException"], () => {
    it("should log the error class name when called with an Error.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter["sendUnknownException"](new Error("Unknown error occurred"), mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).toHaveBeenCalledExactlyOnceWith("Error");
    });

    it("should log the non-error marker when called with a non-Error.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter["sendUnknownException"]("Some unknown exception", mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).toHaveBeenCalledExactlyOnceWith("NonErrorThrown");
    });

    it("should not log the original error message when called with an Error.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter["sendUnknownException"](new Error("Explosive secret value"), mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).not.toHaveBeenCalledWith("Explosive secret value");
    });

    it("should report the error with the registered route template and the request method when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter["sendUnknownException"](new Error("Unknown error occurred"), mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(sentryHelpers.captureServerError).toHaveBeenCalledExactlyOnceWith(expect.any(Error), {
        errorClass: "Error",
        route: "/admin/questions",
        method: "POST",
      });
    });

    it.each<{ test: string; request: SentryReportableRequest; expectedRoute: string; expectedMethod: string }>([
      {
        test: "should report the registered route template when the request carries one.",
        request: { method: "PATCH", routeOptions: { url: "/questions/:id" } },
        expectedRoute: "/questions/:id",
        expectedMethod: "PATCH",
      },
      {
        test: "should report the unknown route when the request carries no route options.",
        request: { method: "POST" },
        expectedRoute: "unknown",
        expectedMethod: "POST",
      },
      {
        test: "should report the unknown route when the route options carry no template.",
        request: { method: "POST", routeOptions: {} },
        expectedRoute: "unknown",
        expectedMethod: "POST",
      },
      {
        test: "should report the unknown method when the request carries no method.",
        request: {},
        expectedRoute: "unknown",
        expectedMethod: "unknown",
      },
      {
        test: "should report an empty route template as-is when the request carries one.",
        request: { method: "POST", routeOptions: { url: "" } },
        expectedRoute: "",
        expectedMethod: "POST",
      },
      {
        test: "should report an empty method as-is when the request carries one.",
        request: { method: "", routeOptions: { url: "/questions/:id" } },
        expectedRoute: "/questions/:id",
        expectedMethod: "",
      },
    ])("$test", ({ request, expectedRoute, expectedMethod }) => {
      const globalExceptionFilter = new GlobalExceptionFilter();

      globalExceptionFilter["sendUnknownException"](new Error("Unknown error occurred"), request, mocks.filters.globalException.fastifyReply);

      expect(sentryHelpers.captureServerError).toHaveBeenCalledExactlyOnceWith(expect.any(Error), {
        errorClass: "Error",
        route: expectedRoute,
        method: expectedMethod,
      });
    });

    it("should send InternalServerErrorException status code using FastifyReply when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const error = new Error("Unknown error occurred");

      globalExceptionFilter["sendUnknownException"](error, mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.status).toHaveBeenCalledExactlyOnceWith(500);
    });

    it("should send InternalServerErrorException response using FastifyReply when called.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      const error = new Error("Unknown error occurred");
      const internalServerError = new InternalServerErrorException();
      const expectedResponse = internalServerError.getResponse();

      globalExceptionFilter["sendUnknownException"](error, mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.send).toHaveBeenCalledExactlyOnceWith(expectedResponse);
    });

    it("should send the 500 response when the tracker call throws.", () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      vi.mocked(sentryHelpers.captureServerError).mockImplementation(() => {
        throw new Error("Tracker is unavailable");
      });

      globalExceptionFilter["sendUnknownException"](new Error("Unknown error occurred"), mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mocks.filters.globalException.fastifyReply.status).toHaveBeenCalledExactlyOnceWith(500);
    });

    it("should log the fixed tracker failure message when the tracker call throws.", () => {
      const mockLogger = getMockedLoggerInstance();
      const globalExceptionFilter = new GlobalExceptionFilter();
      vi.mocked(sentryHelpers.captureServerError).mockImplementation(() => {
        throw new Error("Tracker is unavailable");
      });

      globalExceptionFilter["sendUnknownException"](new Error("Unknown error occurred"), mocks.filters.globalException.request, mocks.filters.globalException.fastifyReply);

      expect(mockLogger.error).toHaveBeenLastCalledWith("Failed to report an unexpected error to Sentry");
    });
  });
});