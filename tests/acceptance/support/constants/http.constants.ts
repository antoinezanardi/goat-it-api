import { HttpStatus } from "@nestjs/common";

const SUCCESS_HTTP_STATUSES: readonly HttpStatus[] = [
  HttpStatus.CREATED,
  HttpStatus.OK,
  HttpStatus.ACCEPTED,
  HttpStatus.NO_CONTENT,
] as const;

export { SUCCESS_HTTP_STATUSES };