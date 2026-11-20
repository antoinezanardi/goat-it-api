import type { NestApplicationOptions } from "@nestjs/common";

const NEST_APPLICATION_OPTIONS: NestApplicationOptions = {
  bufferLogs: true,
  bodyParser: false,
};

export { NEST_APPLICATION_OPTIONS };