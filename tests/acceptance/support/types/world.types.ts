import { World } from "@cucumber/cucumber";
import { ofetch } from "ofetch";
import { model } from "mongoose";

import { QUESTION_THEME_MONGOOSE_SCHEMA, QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import { APP_BASE_URL } from "@acceptance-support/constants/app.constants";

import type { Model } from "mongoose";
import type { IWorldOptions } from "@cucumber/cucumber";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { FetchResponse, $Fetch, FetchOptions } from "ofetch";

class GoatItWorld extends World {
  public lastFetchResponse?: FetchResponse<unknown>;

  public appProcess?: ChildProcessWithoutNullStreams;

  public models!: {
    questionThemes: Model<QuestionThemeMongooseSchema>;
  };

  private readonly fetchInstance: $Fetch;

  public constructor(options: IWorldOptions) {
    super(options);

    this.fetchInstance = ofetch.create({
      baseURL: APP_BASE_URL,
      onResponse: ({ response }) => {
        this.lastFetchResponse = response;
      },
    });
    this.constructTestDatabaseModels();
  }

  public async fetchAndStoreResponse(endpoint: string, fetchOptions?: FetchOptions): Promise<void> {
    try {
      await this.fetchInstance(endpoint, fetchOptions);
    } catch(error) {
      // network-level errors don't trigger onResponse
      if (!this.lastFetchResponse) {
        throw error;
      }
    }
  }

  public expectLastResponseText(): string {
    if (!this.lastFetchResponse) {
      throw new Error("No response stored. Did you forget to call fetchAndStoreResponse()?");
    }
    const { _data: data } = this.lastFetchResponse;

    if (typeof data !== "string") {
      throw new TypeError("The last response data is not of type string.");
    }
    return data;
  }

  public expectLastResponseJson<T>(schema: { parse: (_data: unknown) => T }): T {
    if (!this.lastFetchResponse) {
      throw new Error("No response stored. Did you forget to call fetchAndStoreResponse()?");
    }
    const { _data: data } = this.lastFetchResponse;

    return schema.parse(data);
  }

  private constructTestDatabaseModels(): void {
    this.models = {
      questionThemes: model(QuestionThemeMongooseSchema.name, QUESTION_THEME_MONGOOSE_SCHEMA),
    };
  }
}

export { GoatItWorld };