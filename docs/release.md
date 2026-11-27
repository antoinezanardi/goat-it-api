# Release a Version

Maintainer procedure for publishing a version of the Goat It API. The automation internals live in
[ci-cd.md](ci-cd.md); the ruleset posture and the break-glass procedure live in
[ci-cd.md § Repository rulesets](ci-cd.md#repository-rulesets). Branching, commits and CI are also owned by
[ci-cd.md](ci-cd.md).

## Who can release

The repository has a single maintainer, who owns the release. The maintainer merges the release pull request
into `main`; no other approval is required today (see the `CICD-14` decision in
[ci-cd.md](ci-cd.md#goat-audit-decisions)). When a second maintainer or code owner is added, the exception is
revisited and one approval becomes mandatory.

## How the version is chosen

semantic-release computes the next version from the Conventional Commits since the last tag. The maintainer
never chooses the version:

- `feat` → minor;
- `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `ci` and `chore` → patch;
- `!` after the type or a `BREAKING CHANGE:` footer → major.

The release run on `main` creates the Git tag and the GitHub release. It does not push a release commit.

## Release checklist

### 1. Confirm `develop` is ready

- The latest `develop` run is green, including the required checks.
- The release pull request (`Release v<version>`, `develop` → `main`) exists and its body reflects the current
  `develop`.
- The `Verify release commit is merged 🛡️` check on that pull request is **yellow** at this point. That is
  expected: see [Why the guard can be yellow](#why-the-release-pull-request-check-can-be-yellow).

### 2. Prepare the release commit

Run the preparation from `develop`:

- Actions → `🔃️ Upsert PR Release Workflow` → **Run workflow** → branch `develop` → mode `prepare-release`;
- or `gh workflow run upsert-pr-release.yml --ref develop -f mode=prepare-release`.

Until the workflow reaches `main`, the **Run workflow** button may not be available; the `gh` command works
because the workflow file is already registered on the default branch.

The dispatch forwards to `prepare-release.yml`, which computes the version, creates or updates the
`chore(release): v<version>` pull request (`chore/release` → `develop`) containing the generated
`CHANGELOG.md` section and the `package.json` version bump, and arms it for squash auto-merge. Once
`prepare-release.yml` is on `main` after the next release, it is dispatched directly and the `mode` input
disappears ([#1496](https://github.com/antoinezanardi/goat-it-api/issues/1496)).

Wait for that pull request to merge. The resulting push to `develop` runs `check-release-changelog.yml`, and
the release pull request's `Verify release commit is merged 🛡️` check turns **green**. If `develop` moves
while its checks run, choose **Update branch**; auto-merge does not update the head branch. Re-running step 2
also refreshes it whenever the generated notes changed.

### 3. Merge the release pull request

Open the release pull request into `main` and verify:

- `Verify release commit is merged 🛡️` is green;
- `package.json` and the top `CHANGELOG.md` section show the same version;
- the body reflects the latest `develop`.

Merge it with **Create a merge commit**, the only merge method allowed on `main`.

### 4. Confirm the release

The push to `main` runs `release-creation.yml`; semantic-release creates the tag and the GitHub release, and
`deploy-to-production.yml` builds and deploys the images. Check that:

- the GitHub release exists with the expected notes;
- the production deployment and its liveness health check are green;
- the root endpoint reports the released version in its metadata;
- the `chore: sync release v<version> from main` pull request into `develop` was created and merged
  automatically. If it is behind `develop`, choose **Update branch**; it then auto-merges. Wait for it before
  starting the next release.

### 5. If `develop` moves before the release pull request is merged

Re-run step 2 for the same version. The regenerated notes refresh the changelog, the version pull request
merges again, and the guard turns green for the new `develop` tip.

## Why the release pull request check can be yellow

`check-release-changelog.yml` is path-filtered on `CHANGELOG.md`. Until the prepared release commit changes
that file, the required `Verify release commit is merged 🛡️` check is not reported, so GitHub shows it as
pending (yellow) and blocks the merge. That is the intended state: the release pull request cannot merge
before the release commit exists.

A **red** guard means the workflow ran and failed: `CHANGELOG.md` changed, but its top section does not match
the notes regenerated from semantic-release. Re-run step 2.

A `build` or `revert` commit is the only kind that changes neither the version nor the generated notes. If
one lands after the release commit, the guard does not run on that tip and re-running step 2 is a no-op: run
Actions → `🛡️ Check Release Changelog Workflow` → **Run workflow** on `develop` to report the check on the
current tip, then merge the release pull request.

## Troubleshooting

- **The guard is yellow.** The current `develop` tip does not carry a release commit. Run step 2. If a `build`
  or `revert` commit landed after preparation, run the guard manually as described above.
- **The guard is red.** The committed changelog does not match the generated notes. Run step 2.
- **The version workflow fails with `EGITNOPERMISSION` right after a release.** The sync pull request has not
  merged yet. Wait for `chore: sync release v<version> from main` to land, then re-run the workflow.
- **The sync pull request is blocked.** Check its required checks and its title and branch name, and choose
  **Update branch** when it is behind `develop`; a stale branch is not a break-glass case. Do not force-push
  `develop`; use the break-glass procedure only when the merge is truly blocked.
- **The version pull request does not auto-merge.** Check `Lint Pull Request Name 🔃` and
  `Validate Branch Name 🌿`, and choose **Update branch** when it is behind `develop`.

## Emergency merge (break-glass)

A blocked merge is the only supported emergency. The procedure, including the 24-hour removal deadline and
the requirement to record the waived checks, is in
[ci-cd.md § Repository rulesets](ci-cd.md#repository-rulesets).
