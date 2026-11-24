/**
 * Returns the V8 frame lines of an error stack, dropping the header that may embed the exception message.
 *
 * A stack that does not start with the error's full message header is dropped entirely, so a frame-shaped continuation line of a multiline message cannot survive.
 */
function getErrorStackFrames(exception: Error): string | undefined {
  if (typeof exception.stack !== "string") {
    return undefined;
  }
  const messageHeader = exception.message === "" ? exception.name : `${exception.name}: ${exception.message}`;
  if (!exception.stack.startsWith(messageHeader)) {
    return undefined;
  }
  const stackAfterHeader = exception.stack.slice(messageHeader.length);
  const [stackHeaderRemainder, ...stackFrameCandidates] = stackAfterHeader.split(/\r?\n/u);
  if (stackHeaderRemainder !== "") {
    return undefined;
  }
  const frames = stackFrameCandidates.filter(line => (/^\s+at\s/u).test(line));

  return frames.length > 0 ? frames.join("\n") : undefined;
}

export { getErrorStackFrames };