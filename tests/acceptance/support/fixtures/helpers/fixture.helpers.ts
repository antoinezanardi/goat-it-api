import { FIXTURE_INSERTERS, FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";

import type { DomainFixtureData, FixtureDefinition, FixtureDomain, FixtureKey, FixtureReference } from "@acceptance-support/fixtures/types/fixture.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function loadFixtureDependencies(
  world: GoatItWorld,
  dependencies: readonly FixtureReference<FixtureDomain>[],
  loaded: Set<string>,
): Promise<void> {
  for (const [depDomain, depName] of dependencies) {
    // This is acceptable here because we need to load each dependency sequentially and in order.
    // oxlint-disable-next-line no-await-in-loop
    await loadFixture(world, depDomain, depName, loaded);
  }
}

/**
 * Loads a fixture from the FIXTURE_REGISTRY into the database via the appropriate inserter.
 * Please ensure that you call this function only once per scenario.
 * Only used in acceptance tests.
 * @example
 * await loadFixture(world, "question-theme", "five-question-themes");
 * @param world - The GoatItWorld instance from the current acceptance test context.
 * @param domain - The fixture domain.
 * @param name - The fixture set name within the specified domain.
 * @param loadedKeys - A set of already loaded fixtures to prevent circular dependencies. **[WARNING]** Don't pass this parameter when calling the function externally.
 * @throws Error Throws an error if a circular fixture dependency is detected.
 */
async function loadFixture<Domain extends FixtureDomain>(
  world: GoatItWorld,
  domain: Domain,
  name: FixtureKey<Domain>,
  loadedKeys: Set<string> = new Set(),
): Promise<void> {
  const key = `${domain}:${name}`;
  if (loadedKeys.has(key)) {
    throw new Error(`Circular fixture dependency detected: Trying to load already loaded fixture "${key}".`);
  }
  loadedKeys.add(key);

  // This is acceptable here because we ensure the types via the function signature.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const fixture = FIXTURE_REGISTRY[domain][name] as FixtureDefinition<DomainFixtureData<Domain>>;

  if (fixture.dependencies) {
    // This is acceptable here because we ensure the types via the function signature.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const dependencies = fixture.dependencies as readonly FixtureReference<FixtureDomain>[];
    await loadFixtureDependencies(world, dependencies, loadedKeys);
  }

  await FIXTURE_INSERTERS[domain](world, fixture.data);
}

export {
  loadFixture,
};