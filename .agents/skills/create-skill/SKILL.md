---
name: create-skill
description: Scaffold a new agent skill (SKILL.md) for this project following best practices for OpenCode and Claude Code, then wire up the matching .opencode/skills/ wrapper and command.
---

## What I do

- Determine the correct skill name, scope and purpose from your description
- Create the canonical `SKILL.md` under `.agents/skills/<name>/` with proper frontmatter and content
- Create a thin wrapper under `.opencode/skills/<name>/` that delegates to the canonical file
- Optionally create a matching `.opencode/commands/<name>.md` if the skill is user-invocable
- Validate naming rules and remind you of the checklist before finishing

## When to use me

- You want to encode a repeatable workflow, convention, or domain-specific playbook as a reusable skill
- You are extracting instructions that currently live only in AGENTS.md, a command file, or inline prompts into a proper skill
- You need the skill to be discoverable by both OpenCode (`.opencode/skills/`) and Claude Code / other agents (`.agents/skills/`)

---

## Skill anatomy

Every skill is a directory containing a `SKILL.md` file:

```
.agents/skills/<name>/
└── SKILL.md          # required — frontmatter + instructions
```

Supporting files are optional but encouraged for complex skills:

```
.agents/skills/<name>/
├── SKILL.md          # overview and navigation (keep < 500 lines)
├── reference.md      # detailed reference loaded on demand
├── examples.md       # concrete examples
└── scripts/
    └── helper.sh     # scripts Claude can execute
```

Reference supporting files from `SKILL.md` so Claude knows they exist:

```markdown
## Additional resources

- Full reference: [reference.md](reference.md)
- Examples: [examples.md](examples.md)
```

---

## Frontmatter rules (required)

```yaml
---
name: my-skill          # required — must match the directory name exactly
description: …          # required — 1-1024 chars; be specific enough for auto-discovery
license: MIT            # optional
compatibility: opencode # optional
metadata: # optional, string-to-string map
  audience: developers
---
```

### Name constraints

- 1–64 characters
- Lowercase alphanumeric with single hyphens only: `^[a-z0-9]+(-[a-z0-9]+)*$`
- Must match the containing directory name exactly
- No consecutive `--`, no leading/trailing `-`

### Description guidelines

- Be specific enough that the agent picks this skill over others for the right task
- Include keywords that match how users naturally phrase requests
- Avoid vague phrases like "helps with" — prefer "Scaffolds / Validates / Generates"
- 1–3 sentences is usually enough; do not exceed 1 024 characters

---

## Content best practices

### Structure

Use the following section headings consistently:

```markdown
## What I do — bullet list of concrete actions

## When to use me — trigger conditions (user prompts or code situations)

## Workflow — numbered steps or sub-sections

## Checklist — pre-commit/pre-finish verification items

## Anti-patterns — what NOT to do

## Reference — links to docs, existing files, related skills
```

Not every section is mandatory — include only what is relevant.

### Length and focus

- Keep `SKILL.md` under 500 lines; move large reference tables or examples into separate files
- One skill = one responsibility; split broad skills into focused ones
- Prefer bullet lists and code blocks over dense prose — agents scan structure like humans do

### Instructions quality

Write instructions that are:

- **Concrete and verifiable** — "Run `pnpm run lint`" not "Check the code quality"
- **Ordered** — numbered steps when sequence matters, bullets when order is flexible
- **Scoped** — state clearly what the skill does NOT do to avoid overlap with other skills

### Invocation control (extended frontmatter)

OpenCode only recognises the standard fields: `name`, `description`, `license`, `compatibility`, `metadata`. The fields below are **Claude Code extensions** — they are ignored by OpenCode but safe to include (unknown fields are silently skipped by both platforms).

| Field                            | Effect                                                                        | Platform    |
|----------------------------------|-------------------------------------------------------------------------------|-------------|
| `disable-model-invocation: true` | Only the user can invoke (good for side-effect workflows like deploy, commit) | Claude Code |
| `user-invocable: false`          | Only the agent can invoke (good for background knowledge)                     | Claude Code |
| `allowed-tools: Read, Grep`      | Restrict tools usable when the skill is active                                | Claude Code |
| `context: fork`                  | Run skill in an isolated subagent                                             | Claude Code |
| `agent: Explore`                 | Which subagent type to use when `context: fork`                               | Claude Code |

---

## Discovery locations

Skills are discovered from the following paths (listed highest to lowest priority):

| Location            | Path                               | Discovered by                      |
|---------------------|------------------------------------|------------------------------------|
| Project (canonical) | `.agents/skills/<name>/SKILL.md`   | OpenCode, Claude Code, most agents |
| Project (OpenCode)  | `.opencode/skills/<name>/SKILL.md` | OpenCode                           |
| Project (Claude)    | `.claude/skills/<name>/SKILL.md`   | Claude Code                        |
| Global              | `~/.agents/skills/<name>/SKILL.md` | OpenCode, Claude Code              |

**Convention in this repo**: canonical content lives in `.agents/skills/`, `.opencode/skills/` contains a thin wrapper that references it.

---

## Workflow

### 1. Choose scope and name

- Is this skill project-specific or reusable across projects?
  - Project-specific → `.agents/skills/<name>/` (committed to this repo)
  - Personal/cross-project → `~/.agents/skills/<name>/` (not committed)
- Pick a name: lowercase, hyphen-separated, matches the task (`create-faketory`, `write-unit-test`)

### 2. Create the canonical skill

```bash
mkdir -p .agents/skills/<name>
```

Write `.agents/skills/<name>/SKILL.md` following the template below.

### 3. Create the OpenCode wrapper

```bash
mkdir -p .opencode/skills/<name>
```

Write `.opencode/skills/<name>/SKILL.md` as a thin pointer:

```markdown
---
name: <name>
description: <same description as canonical>
---

The canonical skill definition lives in `.agents/skills/<name>/SKILL.md`.

Load that skill for the full workflow, rules and reference links.
```

### 4. Create the command (optional)

If the skill should be invocable as a slash-command, create `.opencode/commands/<name>.md`:

```markdown
---
description: <one-line description>
agent: build
---

Load the `<name>` skill and follow its workflow.

Use the argument passed to this command as <what the argument means>.
```

### 5. Verify

```
- [ ] Directory name matches `name` in frontmatter exactly
- [ ] `description` is specific and ≤ 1 024 characters
- [ ] Content uses clear headings, bullets and code blocks
- [ ] SKILL.md is < 500 lines (move extras to supporting files)
- [ ] .opencode/skills/<name>/SKILL.md wrapper created
- [ ] .opencode/commands/<name>.md created if user-invocable
- [ ] No duplicate skill name exists in .opencode/skills/ or .agents/skills/
```

---

## Minimal template

Copy and adapt:

```markdown
---
name: my-skill
description: <specific, action-oriented description of what this skill does and when to use it>
---

## What I do

- <action 1>
- <action 2>

## When to use me

- <trigger condition 1>
- <trigger condition 2>

## Workflow

1. <step 1>
2. <step 2>
3. <step 3>

## Checklist before finishing

- [ ] <verification item 1>
- [ ] <verification item 2>

## Anti-patterns to avoid

- <thing not to do>

## Reference

- <link to relevant doc or existing file>
```

---

## Anti-patterns to avoid

- **Vague descriptions** — the agent uses `description` to decide when to load the skill; a vague description leads to wrong or missed invocations
- **Monolithic skills** — one giant skill covering many responsibilities; split into focused ones
- **Duplicating content** — if an authoritative doc already exists (README, AGENTS.md), reference it; don't copy-paste it into the skill
- **Skipping the wrapper** — always create the `.opencode/skills/` wrapper so OpenCode discovers the skill alongside Claude Code
- **Name/directory mismatch** — the skill silently fails to load if `name` in frontmatter doesn't match the directory name

---

## Reference

- OpenCode skills docs: `https://opencode.ai/docs/skills/`
- Claude Code skills docs: `https://docs.anthropic.com/en/docs/claude-code/skills`
- Existing skills to copy from:
  - `.agents/skills/create-faketory/SKILL.md`
  - `.agents/skills/create-mock/SKILL.md`
  - `.agents/skills/write-unit-test/SKILL.md`
- Thin wrapper pattern: `.opencode/skills/create-faketory/SKILL.md`
- Command pattern: `.opencode/commands/create-faketory.md`
