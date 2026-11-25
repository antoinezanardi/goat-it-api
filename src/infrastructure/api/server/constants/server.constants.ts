import type { NestApplicationOptions } from "@nestjs/common";

const NEST_APPLICATION_OPTIONS: Pick<NestApplicationOptions, "bufferLogs" | "bodyParser"> = {
  bufferLogs: true,
  bodyParser: false,
};

export { NEST_APPLICATION_OPTIONS };