import { HttpStatus } from "@nestjs/common";

const SUCCESS_HTTP_STATUSES: readonly number[] = [
  HttpStatus.CREATED,
  HttpStatus.OK,
  HttpStatus.ACCEPTED,
  HttpStatus.NO_CONTENT,
];

export { SUCCESS_HTTP_STATUSES };