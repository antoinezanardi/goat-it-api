import { getErrorStackFrames } from "@app/filters/global-exception/helpers/error-stack/error-stack.helpers";

describe(getErrorStackFrames, () => {
  it.each<{ test: string; message: string; stack: string; expectedStack: string | undefined }>([
    {
      test: "should return the frame lines without the message header when the stack carries both.",
      message: "secret message",
      stack: "Error: secret message\n    at firstFrame (file.js:1:1)\n    at secondFrame (file.js:2:2)",
      expectedStack: "    at firstFrame (file.js:1:1)\n    at secondFrame (file.js:2:2)",
    },
    {
      test: "should return undefined when the stack carries no frame lines.",
      message: "secret message",
      stack: "Error: secret message",
      expectedStack: undefined,
    },
    {
      test: "should return undefined when the stack carries a header separator but no frame lines.",
      message: "secret message",
      stack: "Error: secret message\n",
      expectedStack: undefined,
    },
    {
      test: "should return undefined when the stack is empty.",
      message: "secret message",
      stack: "",
      expectedStack: undefined,
    },
    {
      test: "should handle CRLF stack lines when called.",
      message: "secret message",
      stack: "Error: secret message\r\n    at firstFrame (file.js:1:1)\r\n    at secondFrame (file.js:2:2)",
      expectedStack: "    at firstFrame (file.js:1:1)\n    at secondFrame (file.js:2:2)",
    },
    {
      test: "should drop a multiline message header when the stack carries one.",
      message: "first message line\nsecond message line",
      stack: "Error: first message line\nsecond message line\n    at firstFrame (file.js:1:1)",
      expectedStack: "    at firstFrame (file.js:1:1)",
    },
    {
      test: "should drop a frame-shaped multiline message continuation when the stack carries one.",
      message: "first message line\n    at fakeFrame (evil.js:1:1)",
      stack: "Error: first message line\n    at fakeFrame (evil.js:1:1)\n    at realFrame (file.js:1:1)",
      expectedStack: "    at realFrame (file.js:1:1)",
    },
    {
      test: "should return the frame lines when the error message is empty.",
      message: "",
      stack: "Error\n    at firstFrame (file.js:1:1)",
      expectedStack: "    at firstFrame (file.js:1:1)",
    },
    {
      test: "should return undefined when the stack does not start with the error message header.",
      message: "secret message",
      stack: "Error: another message\n    at firstFrame (file.js:1:1)",
      expectedStack: undefined,
    },
    {
      test: "should return undefined when the stack does not start with the error message header even though a line break follows the header length.",
      message: "secret message",
      stack: "Error: secret messagX\n    at fakeFrame (evil.js:1:1)",
      expectedStack: undefined,
    },
    {
      test: "should return undefined when the message header is followed by content other than a line break.",
      message: "secret message",
      stack: "Error: secret messageBOOM\n    at fakeFrame (evil.js:1:1)",
      expectedStack: undefined,
    },
    {
      test: "should return the frame lines only when a non-frame line precedes them.",
      message: "secret message",
      stack: "Error: secret message\nboom at dawn\n    at firstFrame (file.js:1:1)",
      expectedStack: "    at firstFrame (file.js:1:1)",
    },
  ])("$test", ({ message, stack, expectedStack }) => {
    const error = new Error(message);
    Object.defineProperty(error, "stack", { value: stack });

    expect(getErrorStackFrames(error)).toBe(expectedStack);
  });

  it("should return undefined when the Error carries no stack.", () => {
    const error = new Error("Boom");
    Reflect.deleteProperty(error, "stack");

    expect(getErrorStackFrames(error)).toBeUndefined();
  });

  it("should return undefined when the stack is not a string.", () => {
    const error = new Error("Boom");
    Object.defineProperty(error, "stack", { value: 42 });

    expect(getErrorStackFrames(error)).toBeUndefined();
  });
});