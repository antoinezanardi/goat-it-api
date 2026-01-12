import type { QuestionMongooseDocumentStub } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.types.mock";
import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

type FixtureReference<Domain extends FixtureDomain> = readonly [
  domain: Domain,
  name: FixtureKey<Domain>,
];

type FixtureDomain = keyof FixtureRegistry;

type AnyFixtureReference = {
  [Domain in FixtureDomain]: FixtureReference<Domain>
}[FixtureDomain];

type FixtureDefinition<TData> = {
  data: readonly TData[];
  dependencies?: readonly AnyFixtureReference[];
};

type FixtureRegistry = {
  "question": {
    "five-questions": FixtureDefinition<QuestionMongooseDocumentStub>;
  };
  "question-theme": {
    "five-question-themes": FixtureDefinition<QuestionThemeMongooseDocumentStub>;
    "two-english-only-question-themes": FixtureDefinition<QuestionThemeMongooseDocumentStub>;
  };
};

type FixtureKey<Domain extends FixtureDomain> = Extract<keyof FixtureRegistry[Domain], string>;

type DomainFixtures<Domain extends FixtureDomain> = FixtureRegistry[Domain][FixtureKey<Domain>];

type FixtureData<T> = T extends FixtureDefinition<infer Data> ? Data : never;

type DomainFixtureData<Domain extends FixtureDomain> = FixtureData<DomainFixtures<Domain>>;

type FixtureInserter<TData> = (
  world: GoatItWorld,
  data: readonly TData[],
) => Promise<void>;

type FixtureInserterRegistry = {
  [Domain in FixtureDomain]: FixtureInserter<DomainFixtureData<Domain>>;
};

export type {
  FixtureDomain,
  FixtureDefinition,
  FixtureKey,
  FixtureData,
  DomainFixtureData,
  AnyFixtureReference,
  FixtureReference,
  FixtureRegistry,
  FixtureInserterRegistry,
};