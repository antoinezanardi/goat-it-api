# AGENT — AI-agent tooling hygiene

Hygiene of the AI-agent tooling that builds and reviews the Goat It API: the root `AGENTS.md` contract, the skills under `.agents/skills/**` and their lockfile, the OpenCode agents and commands, `opencode.json` permissions and model configuration, the Copilot and CodeRabbit instruction surfaces, and the GOAT audit checklists themselves. The bar: every instruction an agent reads is true for this repository today, every cross-reference resolves, permissions enforce each agent's role (no commit, no destructive action), and no agent rule contradicts the maintained documentation.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** human documentation drift (README, CONTRIBUTING, guide content) → DOCS · CI workflows, required checks and repository settings → CICD · OpenCode plugin and skill package supply chain → SUP · application file placement → ARCH · lint and TypeScript rules → CODE · test strategy and test-file conventions → TEST · secrets in code or config → SEC

## Contents

- [1. AGENTS.md integrity](#1-agentsmd-integrity)
- [2. Skills hygiene](#2-skills-hygiene)
- [3. Agent definitions](#3-agent-definitions)
- [4. Commands](#4-commands)
- [5. OpenCode configuration](#5-opencode-configuration)
- [6. Copilot and other agent surfaces](#6-copilot-and-other-agent-surfaces)
- [7. GOAT skill self-integrity](#7-goat-skill-self-integrity)
- [Sources](#sources)

## 1. AGENTS.md integrity

- **[AGENT-01] The root AGENTS.md carries the canonical sections** — One plain-Markdown `AGENTS.md` at the repository root covers project overview and stack, build/run/lint/test commands including single-test invocations, code style, test style, git/commit/PR expectations and the useful paths; no root `CLAUDE.md` or `GEMINI.md` carries a competing rule set.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md`, `README.md` · Src: [1], [7]
- **[AGENT-02] Architecture is mandatory reading before any file change** — `AGENTS.md` states that `docs/architecture.md` is the single source of truth and must be read in full before planning or creating, editing, moving or deleting a repository file, and names the consequence for plan writers, implementers and reviewers.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md`, `docs/architecture.md` · Src: [1], project: docs/architecture.md §1
- **[AGENT-03] The DOD checklist is current and conditional** — The Definition of Done lists every conditional item actually enforced today (gates, Bruno, acceptance scenarios, schemas package versioning, error classification, faketories, mocks, module registration, acceptance infrastructure) and each item states its trigger, so an agent can decide applicability without guessing.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md` · Src: [1], project: AGENTS.md
- **[AGENT-04] The skills list matches the skills on disk** — The AGENTS.md agent-skills list names exactly the folders under `.agents/skills/` that contain a `SKILL.md`, in the same spelling, with no missing skill and no listed skill without a folder.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.agents/skills/*/SKILL.md` · Src: [1], [2]
- **[AGENT-05] The command and agent lists match the files** — The AGENTS.md OpenCode command list names exactly the `.opencode/commands/*.md` files with a one-line purpose, and every `.opencode/agents/*.md` agent is named where the workflow refers to it; no listed command or agent is absent and no file is unlisted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.opencode/commands/*.md`, `.opencode/agents/*.md` · Src: [1], [4], [6]
- **[AGENT-06] No competing root instruction file exists** — The repository has exactly one root-level agent instruction file; vendor-specific files under `.github/` point to `AGENTS.md` instead of restating a different rule set, and no secondary root file silently overrides the canonical one.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `AGENTS.md`, `.github/copilot-instructions.md`, `.coderabbit.yaml` · Src: [1], [7], [9]

## 2. Skills hygiene

- **[AGENT-07] Skill frontmatter is valid and unique** — Every `.agents/skills/<folder>/SKILL.md` starts with YAML frontmatter whose `name` equals the folder, matches `^[a-z0-9]+(-[a-z0-9]+)*$`, is unique across the skill roots and is at most 64 characters; the non-empty description is at most 1,024 characters and states what the skill does and when to use it.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.agents/skills/*/SKILL.md` · Src: [2], [3]
- **[AGENT-08] Every skill-lock entry resolves** — Each entry of `skills-lock.json` has `source`, `sourceType`, `skillPath` and `computedHash`, and its key names an existing `.agents/skills/<key>/SKILL.md` whose frontmatter `name` equals the key; locally authored skills are absent from the lockfile.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `skills-lock.json`, `.agents/skills/*/SKILL.md` · Src: [2], project: skills-lock.json
- **[AGENT-09] One folder per skill with a SKILL.md entry point** — Every skill directory contains a `SKILL.md` at its root, supporting files live inside the skill folder rather than beside it, and no nested folder under `.agents/skills/` is itself treated as a skill without its own entry point.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.agents/skills/**` · Src: [2], [3]
- **[AGENT-10] No stale or unreferenced skill remains** — Every skill folder is either listed in the root agent guide and the skills lockfile or is a locally authored skill named in the workflow; a skill removed from the workflow is removed from disk, and no empty or placeholder skill folder survives.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.agents/skills/**`, `skills-lock.json`, `AGENTS.md` · Src: [2], project: AGENTS.md
- **[AGENT-11] Skill descriptions carry a clear trigger** — A locally authored skill description starts with a third-person trigger (`Use when …`) and names both the capability and the situations that should activate it; it does not read as an imperative command, an internal label or a restatement of the folder name.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.agents/skills/*/SKILL.md` · Src: [3], [2]
- **[AGENT-12] Skill-internal references resolve** — Every relative path, template, script and section reference inside a skill resolves within that skill folder or the repository; no skill points at a deleted example, a missing prompt file or a path that only exists on the author's machine.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.agents/skills/**` · Src: [2], [3]

## 3. Agent definitions

- **[AGENT-13] Agent frontmatter is valid for OpenCode** — Every `.opencode/agents/*.md` has a description, a `mode` in `primary`/`subagent`/`all`, a model reference that resolves and a `steps` budget; `default_agent` names an existing primary agent, and each agent's mode matches the role its prompt claims (a read-only reviewer is not declared as an implementation agent).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `opencode.json` · Src: [4], [8]
- **[AGENT-14] Deprecated agent keys are absent** — No agent uses the deprecated `maxSteps` or `tools` keys; `steps` and `permission` are used instead, the singular tool permissions (`question`, `todowrite`, `webfetch`, `websearch`) carry a single action string rather than a pattern object, and `task` permissions use the documented wildcard form.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md` · Src: [4], [5]
- **[AGENT-15] Agent permissions are least-privilege** — Each agent's effective rules begin with a `*` catch-all set to `ask` or `deny` (or rely on a global catch-all), then allow only the commands its role needs; broad allows are paired with denials of their mutating forms (`gh pr merge`, `gh release`, `git reset`, `git clean`, `rm`, `curl -X`, `sed -i`), and every command the prompt requires is allowed or `ask`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `opencode.json` · Src: [5], [4]
- **[AGENT-16] Edit scope matches the agent role** — Review and documentation-fetch agents deny edits; design and planning agents allow edits only inside their output directories; implementation agents hold `edit: allow`; and no read-only agent can write project files through an allowed shell command such as `tee`, `sed -i` or redirection.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `opencode.json` · Src: [4], [5], project: docs/architecture.md §10
- **[AGENT-17] Agent prompts never instruct a commit or push** — Every agent prompt and command states that agents never commit, and none instructs `git add`, `git commit` or `git push`; commit messages may be proposed to the user, and creating a branch with `git checkout -b` remains allowed.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md` · Src: [1], [5], project: AGENTS.md
- **[AGENT-18] Agent rules never contradict the maintained docs** — Where an agent prompt, command or skill restates a rule owned by `docs/architecture.md`, `docs/ci-cd.md`, `docs/unit-tests.md` or `docs/acceptance-tests.md`, the wording matches or explicitly defers to the doc; no agent invents a placement, gate or test rule that the docs do not state.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `docs/architecture.md`, `docs/unit-tests.md` · Src: [1], [7], project: docs/architecture.md §1

## 4. Commands

- **[AGENT-19] Every command binds to an existing agent** — Each `.opencode/commands/*.md` frontmatter names an agent that exists under `.opencode/agents/` or an OpenCode built-in, and the command's instructions are valid for that agent's permissions (a read-only command never asks its agent to write files).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/*.md`, `.opencode/agents/*.md` · Src: [6], [4]
- **[AGENT-20] Command arguments and usage are documented** — Every command that takes arguments documents their names, order and meaning in its body or frontmatter, and the root agent guide's command list gives each command a one-line purpose that matches what the command actually does.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.opencode/commands/*.md`, `AGENTS.md` · Src: [6], [1]
- **[AGENT-21] No dead command remains** — Every command file is reachable from the documented workflow, its referenced scripts and checklists exist, and a removed workflow step removes its command rather than leaving an orphan file that still appears in the command palette.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/*.md`, `package.json`, `AGENTS.md` · Src: [6], project: AGENTS.md
- **[AGENT-22] Command files are self-describing** — Each command has a description that states when to invoke it and what it produces, uses the repository language and naming, and does not duplicate a full guide that a maintained doc already owns.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.opencode/commands/*.md` · Src: [6], [1]

## 5. OpenCode configuration

- **[AGENT-23] Model and default-agent configuration resolves** — The OpenCode configuration parses against its schema, its main and small model references resolve to available models, `default_agent` names an existing primary agent and no agent overrides a model that is unavailable to the project.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [8], [4]
- **[AGENT-24] Plugins and providers are intentional and secret-free** — Every configured plugin is a real package the project intends to load, provider options contain no API key or token, and the configuration contains no secret, private URL or machine-specific path that a fresh clone would not resolve.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `opencode.json`, `package.json` · Src: [8], [7]
- **[AGENT-25] Language servers and formatting aids are configured or intentionally absent** — Every LSP entry names an installed command and language, a broken or speculative server is removed rather than left failing on startup, and the configuration states how lint/type feedback reaches agents.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `opencode.json`, `package.json` · Src: [8], [7]
- **[AGENT-26] A global bash catch-all prevents permissive fallback** — The effective global bash permission starts with a `*` rule set to `ask` or `deny`, and the commit and push denials match the bare command as well as the argument form (`git commit*`, not only `git commit *`); no later agent rule re-allows a denied command, except explicitly documented, path-scoped exceptions after the broad denies: the private advisory POST `gh api -X POST repos/<owner>/<repo>/security-advisories --input docs/audits/*`, evidence writes under `docs/audits/**` (redirection or tee), `/dev/null` probes, and the `curl -D -` stdout header probe.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [5], [8]
- **[AGENT-27] Runtime limits are deliberate** — Compaction, subagent depth and step budgets are set to values the workflow can sustain, a runaway loop is bounded by a step count rather than an unlimited default, and the primary agent's budget is at least the sum its delegated workflow needs.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [8], [4]

## 6. Copilot and other agent surfaces

- **[AGENT-28] Copilot instructions point to the canonical rules** — The Copilot instruction file names the root agent guide and the architecture guide as the rule sources, tells Copilot to read them before acting and states no rule that is absent from or different in those sources.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/copilot-instructions.md`, `AGENTS.md`, `docs/architecture.md` · Src: [9], [1]
- **[AGENT-29] CodeRabbit knowledge-base patterns exist** — When the CodeRabbit configuration enables code guidelines, every `filePatterns` entry matches an existing file, the referenced instruction files contain no rule conflicting with `AGENTS.md`, and review settings that gate merges match the repository's real process.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.coderabbit.yaml`, `AGENTS.md`, `.github/CONTRIBUTING.md` · Src: [10], [1]
- **[AGENT-30] Agent surfaces do not duplicate contradicting rules** — The same rule stated across the root agent guide, the Copilot instructions, the CodeRabbit guidelines and skill files uses the same values (gate order, coverage threshold, branch target, package manager); a surface that cannot stay in sync links the canonical rule instead of copying it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.github/copilot-instructions.md`, `.coderabbit.yaml`, `.agents/skills/**` · Src: [1], [9], [10]

## 7. GOAT skill self-integrity

- **[AGENT-31] The category index matches the reference files** — The GOAT skill's category index lists every reference file, its code, its decision doc and its diff triggers, and each `Core` column value equals the number of `Core: ✓` checks actually present in that reference file.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.agents/skills/**` · Src: project: .agents/skills/goat-audit/SKILL.md §4.4, project: .agents/skills/goat-audit/SKILL.md §6
- **[AGENT-32] Reference files keep the check format and gap-free IDs** — Every check in the GOAT references uses the line shape `- **[CODE-NN] Title** — criterion` followed by the indented metadata `Evidence · Diff · [Core ·] Severity · [Look ·] Src` in that order; each category's IDs form the gap-free sequence `-01`…`-NN`, `Diff: ✓` appears only with `Evidence: static`, and every `Src: [n]` exists in that file's `## Sources`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.agents/skills/**` · Src: project: .agents/skills/goat-audit/SKILL.md §4.1, project: .agents/skills/goat-audit/SKILL.md §4.2
- **[AGENT-33] Every Look glob resolves to a tracked path** — Each backticked glob in a GOAT check's `Look` field matches at least one tracked path; a glob that matches nothing is reported with its check ID and corrected in the same maintenance change instead of being left as a dead hint.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: project: .agents/skills/goat-audit/SKILL.md §11
- **[AGENT-34] Every source URL resolves** — Each URL in a GOAT reference's `## Sources` list returns a final 2xx after redirects; a dead link is reported with its source number and replaced with a fetched official page, never silently kept or invented.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: project: .agents/skills/goat-audit/SKILL.md §11
- **[AGENT-35] The skill ships its templates and decision protocol** — The GOAT skill carries the full-audit report template, the triage templates, the decision-note protocol with its six-bullet entry and the checklist-maintenance rules, and every `[CODE-NN]` cited in an agent, command or template resolves to an active check line.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.agents/skills/**`, `.opencode/agents/*.md`, `.opencode/commands/*.md` · Src: project: .agents/skills/goat-audit/SKILL.md §7, project: .agents/skills/goat-audit/SKILL.md §11

## Sources

[1] AGENTS.md: https://agents.md/ (fetched 2026-11-04)
[2] OpenCode — Agent Skills: https://opencode.ai/docs/skills (fetched 2026-11-04)
[3] Agent Skills — Specification: https://agentskills.io/specification (fetched 2026-11-04)
[4] OpenCode — Agents: https://opencode.ai/docs/agents (fetched 2026-11-04)
[5] OpenCode — Permissions: https://opencode.ai/docs/permissions (fetched 2026-11-04)
[6] OpenCode — Commands: https://opencode.ai/docs/commands (fetched 2026-11-04)
[7] OpenCode — Rules: https://opencode.ai/docs/rules (fetched 2026-11-04)
[8] OpenCode — Config: https://opencode.ai/docs/config (fetched 2026-11-04)
[9] GitHub Docs — Adding repository custom instructions for GitHub Copilot: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions (fetched 2026-11-04)
[10] CodeRabbit — Code Guidelines: https://docs.coderabbit.ai/knowledge-base/code-guidelines (fetched 2026-11-04)
