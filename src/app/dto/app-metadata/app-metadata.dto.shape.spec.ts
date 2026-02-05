import { ZodError } from "zod";

import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";
import { APP_METADATA_DTO } from "@app/dto/app-metadata/app-metadata.dto.shape";

import { createFakeAppMetadata } from "@faketories/app/app.faketory";

describe("App Metadata DTO Shape", () => {
  let validAppMetadataDto: AppMetadataDto | Record<string, unknown>;

  beforeEach(() => {
    validAppMetadataDto = createFakeAppMetadata();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_METADATA_DTO.parse(validAppMetadataDto)).not.toThrowError();
  });

  describe("name", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { name: 123 });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when assigned an empty string.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { name: "" });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(APP_METADATA_DTO.shape.name.description).toBe("Application's name");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Application's name",
        example: "Goat It",
      };

      expect(APP_METADATA_DTO.shape.name.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("version", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { version: 456 });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it.each<{
      test: string;
      value: string;
    }>([
      {
        test: "should throw a zod error when assigned an invalid version format with missing minor and patch.",
        value: "1",
      },
      {
        test: "should throw a zod error when assigned an invalid version format with missing patch.",
        value: "1.0",
      },
      {
        test: "should throw a zod error when assigned an invalid version format with letters.",
        value: "version1.0.0",
      },
      {
        test: "should throw a zod error when assigned an invalid version format with special characters.",
        value: "1.0.0!",
      },
      {
        test: "should throw a zod error when assigned an invalid version format with spaces.",
        value: "1. 0.0",
      },
      {
        test: "should throw a zod error when assigned an invalid version format with empty string.",
        value: "",
      },
    ])("$test", ({ value }) => {
      const invalidDto = Object.assign(validAppMetadataDto, { version: value });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it.each<{
      test: string;
      value: string;
    }>([
      {
        test: "should pass validation when assigned a valid semantic version format with simple version.",
        value: "1.0.0",
      },
      {
        test: "should pass validation when assigned a valid semantic version format with advanced version.",
        value: "23.35.31-beta.1",
      },
      {
        test: "should pass validation when assigned a valid semantic version format with pre-release tag.",
        value: "2.1.0-alpha",
      },
    ])("$test", ({ value }) => {
      const validDto = Object.assign(validAppMetadataDto, { version: value });

      expect(() => APP_METADATA_DTO.parse(validDto)).not.toThrowError();
    });

    it("should have correct description when accessing the description.", () => {
      expect(APP_METADATA_DTO.shape.version.description).toBe("Application's version from package.json");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Application's version from package.json",
        example: "1.8.0",
      };

      expect(APP_METADATA_DTO.shape.version.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { description: 789 });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when assigned an empty string.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { description: "" });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(APP_METADATA_DTO.shape.description.description).toBe("Application's description from package.json");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Application's description from package.json",
        example: "An AI-powered question and answer platform.",
      };

      expect(APP_METADATA_DTO.shape.description.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("packageName", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { packageName: true });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when assigned an invalid slug.", () => {
      const invalidDto = Object.assign(validAppMetadataDto, { packageName: "Invalid Package!" });

      expect(() => APP_METADATA_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(APP_METADATA_DTO.shape.packageName.description).toBe("Application's package name from package.json");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Application's package name from package.json",
        example: "goat-it-api",
      };

      expect(APP_METADATA_DTO.shape.packageName.meta()).toStrictEqual(expectedMetadata);
    });
  });
});