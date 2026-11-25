import type { NestApplicationOptions } from "@nestjs/common";

// Acceptable as NestJS accepts a structural options object and does not construct NestApplicationOptions
// oxlint-disable-next-line typescript/no-unsafe-class-instance-assignment
const NEST_APPLICATION_OPTIONS: NestApplicationOptions = {
  bufferLogs: true,
  bodyParser: false,
};

export { NEST_APPLICATION_OPTIONS };