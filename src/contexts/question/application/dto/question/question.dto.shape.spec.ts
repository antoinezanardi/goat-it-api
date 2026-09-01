import { ZodError } from "zod";

import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import { QUESTION_DTO } from "@question/application/dto/question/question.dto.shape";

describe("Question DTO Shape", () => {
  let validQuestionDto: {
    id: string;
    category: string;
    themes: { theme: Record<string, unknown>; isPrimary: boolean; isHint: boolean }[];
    content: { statement: string; answer: string; context?: string; trivia?: string[] };
    cognitiveDifficulty: string;
    author: { role: string; gameId?: string; name?: string };
    status: string;
    rejection?: { type: string; comment?: string };
    sourceUrls: string[];
    createdAt: string;
    updatedAt: string;
  };

  beforeEach(() => {
    validQuestionDto = {
      id: "60af924f4f1a2563f8e8b456",
      category: "trivia",
      themes: [
        {
          theme: {
            id: "60af924f4f1a2563f8e8b457",
            slug: "general-knowledge",
            label: "General Knowledge",
            aliases: ["gk", "trivia"],
            description: "General knowledge questions",
            color: "#FF5733",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: true,
          isHint: false,
        },
      ],
      content: { statement: "What is the capital of France?", answer: "Paris" },
      cognitiveDifficulty: "easy",
      author: { role: "admin", name: "TestAuthor" },
      status: "active",
      sourceUrls: ["https://example.com/source1"],
      createdAt: "2026-04-14T00:00:00.000Z",
      updatedAt: "2026-04-14T00:00:00.000Z",
    };
  });

  it("should pass validation when a valid QuestionDto is provided.", () => {
    expect(() => QUESTION_DTO.parse(validQuestionDto)).not.toThrow();
  });

  describe("id", () => {
    it("should throw zod error when id is invalid.", () => {
      const dtoWithInvalidId = { ...validQuestionDto, id: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidId)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.id.meta();
      const expectedMetadata = {
        description: "Question's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("category", () => {
    it("should throw zod error when category is invalid.", () => {
      const dtoWithInvalidCategory = { ...validQuestionDto, category: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCategory)).toThrow(ZodError);
    });
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const dtoWithEmptyThemes = { ...validQuestionDto, themes: [] };

      expect(() => QUESTION_DTO.parse(dtoWithEmptyThemes)).toThrow(ZodError);
    });

    it("should throw zod error when themes is invalid.", () => {
      const dtoWithInvalidThemes = { ...validQuestionDto, themes: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidThemes)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.themes.meta();
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
            label: "General Knowledge",
            aliases: ["gk", "trivia"],
            description: "General knowledge questions",
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
            label: "Science",
            aliases: ["sci", "nature"],
            description: "Science questions",
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
            label: "History",
            aliases: ["hist", "past"],
            description: "History questions",
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
            label: "Geography",
            aliases: ["geo", "world"],
            description: "Geography questions",
            color: "#FF33E6",
            status: "active",
            updatedAt: "2026-04-14T00:00:00.000Z",
            createdAt: "2026-04-14T00:00:00.000Z",
          },
          isPrimary: false,
          isHint: true,
        },
      ];
      const dtoWithTooManyThemes = { ...validQuestionDto, themes };

      expect(() => QUESTION_DTO.parse(dtoWithTooManyThemes)).toThrow(ZodError);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const dtoWithInvalidContent = { ...validQuestionDto, content: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidContent)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const dtoWithInvalidCognitiveDifficulty = { ...validQuestionDto, cognitiveDifficulty: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCognitiveDifficulty)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const dtoWithInvalidAuthor = { ...validQuestionDto, author: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidAuthor)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = { ...validQuestionDto, status: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.status.meta();
      const expectedMetadata = {
        description: "Question's status",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("rejection", () => {
    it("should throw zod error when rejection is invalid.", () => {
      const dtoWithInvalidRejection = { ...validQuestionDto, rejection: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidRejection)).toThrow(ZodError);
    });

    it("should pass validation when rejection is omitted.", () => {
      const dtoWithoutRejection = { ...validQuestionDto, rejection: undefined };

      expect(() => QUESTION_DTO.parse(dtoWithoutRejection)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.rejection.meta();
      const expectedMetadata = {
        description: "Question's rejection details, if applicable",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sourceUrls", () => {
    it("should throw zod error when sourceUrls is invalid.", () => {
      const dtoWithInvalidSourceUrls = { ...validQuestionDto, sourceUrls: "invalid" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidSourceUrls)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.sourceUrls.meta();
      const expectedMetadata = {
        description: "List of unique source URLs for the question",
        example: [
          "https://example.com/source1",
          "https://example.com/source2",
        ],
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt / updatedAt", () => {
    it("should throw zod error when createdAt is invalid.", () => {
      const dtoWithInvalidCreatedAt = { ...validQuestionDto, createdAt: "not-a-date" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCreatedAt)).toThrow(ZodError);
    });

    it("should throw zod error when updatedAt is invalid.", () => {
      const dtoWithInvalidUpdatedAt = { ...validQuestionDto, updatedAt: "not-a-date" };

      expect(() => QUESTION_DTO.parse(dtoWithInvalidUpdatedAt)).toThrow(ZodError);
    });

    it("should have correct metadata for createdAt when accessed.", () => {
      const metadata = QUESTION_DTO.shape.createdAt.meta();
      const expectedMetadata = {
        description: "Question's creation date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have correct metadata for updatedAt when accessed.", () => {
      const metadata = QUESTION_DTO.shape.updatedAt.meta();
      const expectedMetadata = {
        description: "Question's last update date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});