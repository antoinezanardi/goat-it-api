import { z } from "zod";

const QUESTION_CONTENT_DTO = z.strictObject({
  statement: z.string()
    .describe("Question translated statement")
    .meta({ example: "What is the capital of France?" }),
  answer: z.string()
    .describe("Question translated answer")
    .meta({ example: "The capital of France is Paris." }),
  context: z.string()
    .optional()
    .describe("Additional translated context for the question")
    .meta({ example: "France is a country in Western Europe." }),
  trivia: z.array(z.string())
    .optional()
    .describe("Interesting translated trivia related to the question")
    .meta({ example: ["Paris is known as the 'City of Light'.", "The Eiffel Tower is located in Paris."] }),
}).describe("Question's content");

export { QUESTION_CONTENT_DTO };