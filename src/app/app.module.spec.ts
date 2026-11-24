import { HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { ZodResponse, ZodSerializationException, ZodSerializerDto, ZodSerializerInterceptor } from "nestjs-zod";
import { firstValueFrom, of } from "rxjs";

import { ApiThrottlerModule } from "@src/infrastructure/api/server/throttler/throttler.module";

import { AppModule } from "@app/app.module";
import { AppMetadataNestZodDto } from "@app/dto/app-metadata/app-metadata.dto";
import { GlobalExceptionFilter } from "@app/filters/global-exception/global-exception.filter";
import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

import type { ExecutionContext } from "@nestjs/common";
import type { Observable } from "rxjs";

const originalEnvironmentVariables = vi.hoisted(() => {
  const testEnvironmentVariables = {
    SERVER_HOST: "0.0.0.0",
    SERVER_PORT: "4242",
    CORS_ORIGIN: "*",
    MONGODB_HOST: "0.0.0.0",
    MONGODB_PORT: "27017",
    MONGODB_DATABASE: "goat-it-test",
    FALLBACK_LOCALE: "en",
    API_KEY_HMAC_SECRET: "test_hmac_secret_key_for_api_key_signing_1234",
    ADMIN_API_KEY: "test_admin_api_key_for_testing",
    GAME_API_KEY: "test_game_api_key_for_testing",
  };
  const originalVariables: Record<string, string | undefined> = {};

  for (const [name, value] of Object.entries(testEnvironmentVariables)) {
    originalVariables[name] = process.env[name];
    process.env[name] = value;
  }
  return originalVariables;
});

type DriftedAppMetadataDto = AppMetadataDto & { leakedField: string };

const validAppMetadataDto: AppMetadataDto = {
  name: "Goat It",
  version: "1.8.0",
  description: "An AI-powered question and answer platform.",
  packageName: "goat-it-api",
};

class SerializationFixtureController {
  private readonly validMetadata: AppMetadataDto = validAppMetadataDto;

  private readonly driftedMetadata: DriftedAppMetadataDto = { ...validAppMetadataDto, leakedField: "should-never-reach-the-client" };

  private readonly incompleteMetadata: unknown = {
    version: validAppMetadataDto.version,
    description: validAppMetadataDto.description,
    packageName: validAppMetadataDto.packageName,
  };

  private readonly nullMetadata: unknown = null;

  private readonly driftedMetadataList: unknown = [{ ...validAppMetadataDto, leakedField: "should-never-reach-the-client" }];

  @ZodResponse({ status: HttpStatus.OK, type: AppMetadataNestZodDto })
  public getValidMetadata(): AppMetadataDto {
    return this.validMetadata;
  }

  @ZodResponse({ status: HttpStatus.OK, type: AppMetadataNestZodDto })
  public getDriftedMetadata(): AppMetadataDto {
    return this.driftedMetadata;
  }

  @ZodSerializerDto(AppMetadataNestZodDto)
  public getIncompleteMetadata(): unknown {
    return this.incompleteMetadata;
  }

  @ZodSerializerDto(AppMetadataNestZodDto)
  public getNullMetadata(): unknown {
    return this.nullMetadata;
  }

  @ZodSerializerDto([AppMetadataNestZodDto])
  public getDriftedMetadataList(): unknown {
    return this.driftedMetadataList;
  }
}

type SerializationFixtureMethod = "getValidMetadata" | "getDriftedMetadata" | "getIncompleteMetadata" | "getNullMetadata" | "getDriftedMetadataList";

async function runSerializationInterceptor(methodName: SerializationFixtureMethod): Promise<unknown> {
  const fixtureMethod: () => unknown = SerializationFixtureController.prototype[methodName];
  const zodSerializerInterceptor = new ZodSerializerInterceptor(new Reflector());
  // Acceptable as the fixture only implements the two context accessors the interceptor reads
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const context = {
    getHandler: (): unknown => fixtureMethod,
    getClass: (): unknown => SerializationFixtureController,
  } as unknown as ExecutionContext;
  const next = { handle: (): Observable<unknown> => of(fixtureMethod.call(new SerializationFixtureController())) };

  return firstValueFrom(zodSerializerInterceptor.intercept(context, next));
}

async function catchSerializationError(methodName: SerializationFixtureMethod): Promise<ZodSerializationException> {
  try {
    await runSerializationInterceptor(methodName);
  } catch(error) {
    if (error instanceof ZodSerializationException) {
      return error;
    }
    throw error;
  }
  throw new Error("Expected the interceptor to reject the response");
}

describe(AppModule, () => {
  beforeAll(async() => {
    await ConfigModule.envVariablesLoaded;
  });

  afterAll(() => {
    for (const [name, value] of Object.entries(originalEnvironmentVariables)) {
      if (value === undefined) {
        Reflect.deleteProperty(process.env, name);
      } else {
        process.env[name] = value;
      }
    }
  });

  it("should register the global exception filter as an application filter when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("providers", AppModule)).toContainEqual({ provide: APP_FILTER, useClass: GlobalExceptionFilter });
  });

  it("should register the Zod serializer interceptor as an application interceptor when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("providers", AppModule)).toContainEqual({ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor });
  });

  it("should import the api throttler module when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("imports", AppModule)).toContainEqual(ApiThrottlerModule);
  });

  it("should apply the localization middleware to every route when configured.", () => {
    const forRoutes = vi.fn<(route: string) => void>();
    const apply = vi.fn<(middleware: unknown) => { forRoutes: typeof forRoutes }>().mockReturnValue({ forRoutes });
    const appModule = new AppModule();

    appModule.configure({ apply } as never);

    expect(apply).toHaveBeenCalledExactlyOnceWith(LocalizationMiddleware);
  });

  it("should register the localization middleware for all routes when configured.", () => {
    const forRoutes = vi.fn<(route: string) => void>();
    const apply = vi.fn<(middleware: unknown) => { forRoutes: typeof forRoutes }>().mockReturnValue({ forRoutes });
    const appModule = new AppModule();

    appModule.configure({ apply } as never);

    expect(forRoutes).toHaveBeenCalledExactlyOnceWith("*");
  });

  describe("response serialization", () => {
    it("should return the parsed payload when the response matches its DTO when intercepted.", async() => {
      await expect(runSerializationInterceptor("getValidMetadata")).resolves.toStrictEqual(validAppMetadataDto);
    });

    it("should throw a ZodSerializationException when the response carries an unknown field when intercepted.", async() => {
      await expect(runSerializationInterceptor("getDriftedMetadata")).rejects.toBeInstanceOf(ZodSerializationException);
    });

    it("should throw a ZodSerializationException when a required response field is missing when intercepted.", async() => {
      await expect(runSerializationInterceptor("getIncompleteMetadata")).rejects.toBeInstanceOf(ZodSerializationException);
    });

    it("should throw a ZodSerializationException when the response is null when intercepted.", async() => {
      await expect(runSerializationInterceptor("getNullMetadata")).rejects.toBeInstanceOf(ZodSerializationException);
    });

    it("should throw a ZodSerializationException when one array element drifts when intercepted.", async() => {
      await expect(runSerializationInterceptor("getDriftedMetadataList")).rejects.toBeInstanceOf(ZodSerializationException);
    });

    it("should expose a serialization failure as HTTP 500 when a response drifts when intercepted.", async() => {
      const serializationError = await catchSerializationError("getDriftedMetadata");

      expect(serializationError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});