import { World } from "@cucumber/cucumber";
import { ofetch } from "ofetch";

import { APP_BASE_URL } from "@acceptance-support/constants/app.constants";

import type { IWorldOptions } from "@cucumber/cucumber";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { FetchResponse, $Fetch } from "ofetch";

class GoatItWorld extends World {
  public lastFetchResponse?: FetchResponse<unknown>;

  public appProcess?: ChildProcessWithoutNullStreams;

  private readonly fetchInstance: $Fetch;

  public constructor(options: IWorldOptions) {
    super(options);

    this.fetchInstance = ofetch.create({
      baseURL: APP_BASE_URL,
    });
  }

  public async fetchAndStoreResponse(endpoint: string): Promise<void> {
    this.lastFetchResponse = await this.fetchInstance.raw(endpoint);
  }

  public expectLastResponseJson<T>(schema: { parse: (u: unknown) => T }): T {
    if (!this.lastFetchResponse) {
      throw new Error("No response stored");
    }
    const { _data: data } = this.lastFetchResponse;

    return schema.parse(data);
  }
}

export { GoatItWorld };