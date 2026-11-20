import { faker } from "@faker-js/faker";

import { SENTRY_ENVIRONMENTS } from "@src/infrastructure/api/config/constants/env.constants";

import type { SentryErrorEvent, SentryExceptionValue, SentryStackFrame, SentryTags } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers.types";

function createFakeSentrySdk(): NonNullable<SentryErrorEvent["sdk"]> {
  return {
    name: "sentry.javascript.nestjs",
    version: faker.system.semver(),
    packages: [
      {
        name: "npm:@sentry/nestjs",
        version: faker.system.semver(),
      },
    ],
  };
}

function createFakeSentryRequest(): NonNullable<SentryErrorEvent["request"]> {
  const queryParameterName = faker.lorem.word();
  const queryParameterValue = faker.lorem.word();

  return {
    url: `${faker.internet.url({ appendSlash: false })}?${queryParameterName}=${queryParameterValue}`,
    method: faker.internet.httpMethod(),
    headers: {
      authorization: faker.string.uuid(),
    },
    data: {
      statement: faker.lorem.sentence(),
    },
  };
}

function createFakeSentryTags(): SentryTags {
  return {
    "errorClass": `${faker.lorem.word()}Error`,
    "http.route": `/${faker.lorem.slug()}`,
    "http.request.method": faker.internet.httpMethod(),
    "http.response.status_code": faker.helpers.arrayElement(["400", "409", "500"]),
    "http.request.id": faker.string.uuid(),
    "feature": faker.lorem.word(),
  };
}

function createFakeSentryStackFrame(): SentryStackFrame {
  return {
    filename: `/app/dist/${faker.lorem.slug()}.js`,
    function: faker.lorem.word(),
    lineno: faker.number.int({ min: 1, max: 1000 }),
    colno: faker.number.int({ min: 1, max: 1000 }),
    in_app: faker.datatype.boolean(),
    context_line: faker.lorem.sentence(),
    pre_context: [faker.lorem.sentence()],
    post_context: [faker.lorem.sentence()],
    vars: {
      [faker.lorem.word()]: faker.lorem.sentence(),
    },
    module: faker.lorem.word(),
  };
}

function createFakeSentryExceptionValue(): SentryExceptionValue {
  return {
    type: `${faker.lorem.word()}Error`,
    value: faker.lorem.sentence(),
    mechanism: {
      type: "generic",
      handled: false,
      data: {
        [faker.lorem.word()]: faker.lorem.word(),
      },
    },
    stacktrace: {
      frames: [createFakeSentryStackFrame()],
    },
  };
}

function createFakeSentryErrorEvent(overrides: Partial<SentryErrorEvent> = {}): SentryErrorEvent {
  return {
    type: undefined,
    event_id: faker.string.hexadecimal({ length: 32, casing: "lower", prefix: "" }),
    timestamp: faker.date.anytime().getTime(),
    level: "error",
    platform: "node",
    sdk: createFakeSentrySdk(),
    environment: faker.helpers.arrayElement(SENTRY_ENVIRONMENTS),
    release: `goat-it-api@${faker.system.semver()}`,
    server_name: faker.internet.domainName(),
    transaction: `/${faker.lorem.slug()}`,
    request: createFakeSentryRequest(),
    user: {
      id: faker.string.uuid(),
      ip_address: faker.internet.ipv4(),
    },
    contexts: {
      runtime: {
        name: "node",
        version: faker.system.semver(),
      },
    },
    extra: {
      payload: faker.lorem.sentence(),
    },
    breadcrumbs: [
      {
        message: faker.lorem.sentence(),
        category: faker.lorem.word(),
        level: "error",
      },
    ],
    modules: {
      mongoose: faker.system.semver(),
    },
    tags: createFakeSentryTags(),
    exception: {
      values: [createFakeSentryExceptionValue()],
    },
    ...overrides,
  };
}

export { createFakeSentryErrorEvent };