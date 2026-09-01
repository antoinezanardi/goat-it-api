import { ZodError } from "zod";

import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import { ADMIN_QUESTION_DTO } from "@question/application/dto/admin-question/admin-question.dto.shape";

describe("Admin Question DTO Shape", () => {
  let validAdminQuestionDto: {
    id: string;
    category: string;
    themes: { theme: Record<string, unknown>; isPrimary: boolean; isHint: boolean }[];
    content: { statement: { en: string }; answer: { en: string } };
    cognitiveDifficulty: string;
    author: { role: string; gameId?: string; name?: string };
    status: string;
    rejection?: { type: string; comment?: string };
    sourceUrls: string[];
    createdAt: string;
    updatedAt: string;
  };

  beforeEach(() => {
    validAdminQuestionDto = {
      id: "60af924f4f1a2563f8e8b456",
      category: "trivia",
      themes: [
        {
          theme: {
            id: "60af924f4f1a2563f8e8b457",
            slug: "general-knowledge",
            label: { en: "General Knowledge" },
            aliases: { en: ["gk", "trivia"] },
            description: { en: "General knowledge questions" },
            color: "#FF5733",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: true,
          isHint: false,
        },
      ],
      content: { statement: { en: "What is the capital of France?" }, answer: { en: "Paris" } },
      cognitiveDifficulty: "easy",
      author: { role: "admin", name: "TestAuthor" },
      status: "active",
      sourceUrls: ["https://example.com/source1"],
      createdAt: "2026-04-14T00:00:00.000Z",
      updatedAt: "2026-04-14T00:00:00.000Z",
    };
  });

  it("should pass validation when a valid AdminQuestionDto is provided.", () => {
    expect(() => ADMIN_QUESTION_DTO.parse(validAdminQuestionDto)).not.toThrow();
  });

  describe("id", () => {
    it("should throw zod error when id is invalid.", () => {
      const dtoWithInvalidId = { ...validAdminQuestionDto, id: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidId)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.id.meta();
      const expectedMetadata = {
        description: "Question's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const dtoWithEmptyThemes = { ...validAdminQuestionDto, themes: [] };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithEmptyThemes)).toThrow(ZodError);
    });

    it("should throw zod error when themes is invalid.", () => {
      const dtoWithInvalidThemes = { ...validAdminQuestionDto, themes: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidThemes)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should throw zod error when themes exceed maximum items.", () => {
      const themes = [
        {
          theme: {
            id: "60af924f4f1a2563f8e8b457",
            slug: "general-knowledge",
            label: { en: "General Knowledge" },
            aliases: { en: ["gk", "trivia"] },
            description: { en: "General knowledge questions" },
            color: "#FF5733",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: true,
          isHint: false,
        },
        {
          theme: {
            id: "60af924f4f1a2563f8e8b458",
            slug: "science",
            label: { en: "Science" },
            aliases: { en: ["sci", "nature"] },
            description: { en: "Science questions" },
            color: "#33FF57",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: false,
          isHint: true,
        },
        {
          theme: {
            id: "60af924f4f1a2563f8e8b459",
            slug: "history",
            label: { en: "History" },
            aliases: { en: ["hist", "past"] },
            description: { en: "History questions" },
            color: "#3357FF",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: false,
          isHint: false,
        },
        {
          theme: {
            id: "60af924f4f1a2563f8e8b460",
            slug: "geography",
            label: { en: "Geography" },
            aliases: { en: ["geo", "world"] },
            description: { en: "Geography questions" },
            color: "#FF33E6",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: false,
          isHint: true,
        },
      ];
      const dtoWithTooManyThemes = { ...validAdminQuestionDto, themes };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithTooManyThemes)).toThrow(ZodError);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const dtoWithInvalidContent = { ...validAdminQuestionDto, content: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidContent)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const dtoWithInvalidCognitiveDifficulty = { ...validAdminQuestionDto, cognitiveDifficulty: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidCognitiveDifficulty)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const dtoWithInvalidAuthor = { ...validAdminQuestionDto, author: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidAuthor)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = { ...validAdminQuestionDto, status: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.status.meta();
      const expectedMetadata = {
        description: "Question's status",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("rejection", () => {
    it("should throw zod error when rejection is invalid.", () => {
      const dtoWithInvalidRejection = { ...validAdminQuestionDto, rejection: "invalid" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidRejection)).toThrow(ZodError);
    });

    it("should pass validation when rejection is omitted.", () => {
      const dtoWithoutRejection = { ...validAdminQuestionDto, rejection: undefined };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithoutRejection)).not.toThrow();
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.rejection.meta();
      const expectedMetadata = {
        description: "Question's rejection details, if applicable",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt / updatedAt", () => {
    it("should throw zod error when createdAt is invalid.", () => {
      const dtoWithInvalidCreatedAt = { ...validAdminQuestionDto, createdAt: "not-a-date" };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidCreatedAt)).toThrow(ZodError);
    });

    it("should throw zod error when updatedAt is invalid.", () => {
      const dtoWithInvalidUpdatedAt = { ...validAdminQuestionDto, updatedAt: 12_345 };

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidUpdatedAt)).toThrow(ZodError);
    });

    it("should have correct metadata for createdAt when accessed.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.createdAt.meta();
      const expectedMetadata = {
        description: "Question's creation date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have correct metadata for updatedAt when accessed.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.updatedAt.meta();
      const expectedMetadata = {
        description: "Question's last update date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});