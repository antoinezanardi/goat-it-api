import { DEFAULT_SERVER_PORT, SERVER_HOST } from "@acceptance-support/constants/app.constants";

function getServerPort(): number {
  return Number(process.env.SERVER_PORT) || DEFAULT_SERVER_PORT;
}

function getAppBaseUrl(): string {
  return `http://${SERVER_HOST}:${getServerPort()}`;
}

export {
  getServerPort,
  getAppBaseUrl,
};