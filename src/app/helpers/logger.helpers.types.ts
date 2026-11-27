type LoggedRequest = {
  id: string | number | object | undefined;
  method: string | undefined;
  url: string | undefined;
};

type LoggedResponse = {
  statusCode: number | null;
};

export type {
  LoggedRequest,
  LoggedResponse,
};