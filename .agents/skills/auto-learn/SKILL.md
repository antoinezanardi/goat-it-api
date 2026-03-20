---
name: auto-learn
description: Detect when user corrects AI output, search docs for related guidance, and prompt user to update docs if gaps are found to prevent repeating mistakes.
---

## What I do

- **Detect corrections** — Recognize when a user is providing a correction/fix (not just a comment)
- **Search docs** — Scan `.agents/skills/*.SKILL.md`, `docs/*.md`, and `tests/*/README.md` for related guidance
- **Report findings** — Confirm AI learned ("✅ Found it") or surface gaps ("⚠️ Not documented")
- **Prompt for updates** — If guidance is missing, ask user to help document the lesson
- **Edit docs directly** — Apply user-approved changes to `.SKILL.md`, `docs/`, or `tests/` files
- **Commit automatically** — Create git commits with descriptive messages linking the lesson to the original correction

## When to use me

- **Automatically after ANY skill execution** where user provides a correction
- **Explicitly via `/update-docs` command** when user wants to teach me a lesson intentionally

---

## Workflow

### Step 1: Detect Correction

User provides feedback to AI-generated output. I detect a **correction** if the message contains one or more of these keywords:

| Pattern | Keywords |
|---------|----------|
| Negation/prohibition | "don't", "no", "never", "forbidden", "can't", "should not" |
| Requirement | "should", "must", "required", "needs", "missing", "needs to" |
| Rule violation | "violates", "breaks", "incorrect", "wrong", "bad", "against the rule" |
| Anti-pattern | "anti-pattern", "wrong approach", "bad practice", "don't do this" |
| Missing guidance | "where's", "where is", "why didn't", "forgot", "missing test" |
| Contradiction | "contradicts", "conflicts with", "doesn't match", "opposite" |

**If uncertain**, I ask: *"Is this a correction I should learn from? (y/n)"*

**Example corrections I detect:**
- "This violates the no-switch rule. Fix it."
- "Where's the DTO validation test? That's required."
- "This anti-pattern breaks AGENTS.md conventions."

### Step 2: Apply Fix

Either the user or I apply the correction to the generated output:
- Remove anti-pattern code (e.g., switch statement → object map)
- Add missing test, section, or example
- Clarify documentation
- Update guidance in a skill

### Step 3: Search Docs

I search ALL of these files for guidance related to the correction:

**Skill files:**
- `.agents/skills/*/SKILL.md` (e.g., write-unit-test.SKILL.md, challenge-plan.SKILL.md)

**Main documentation:**
- `docs/ARCHITECTURE.md`
- `docs/UNIT-TESTS.md`
- `docs/ACCEPTANCE-TESTS.md`
- `docs/FAKETORIES.md`
- `docs/MOCKS.md`
- `AGENTS.md`

**Test documentation:**
- `tests/unit/README.md`
- `tests/acceptance/README.md`
- `tests/shared/utils/faketories/README.md`
- `tests/unit/utils/mocks/README.md`

I use **keyword matching** based on terms from the user's correction. For example:
- Correction mentions "switch" → Search for "switch" or "case" or "polymorphism"
- Correction mentions "DTO validation" → Search for "DTO" AND "validation" AND "test"
- Correction mentions "mapper side effects" → Search for "mapper" AND "side effect" OR "pure"

### Step 4: Report Findings

**If I find related guidance:**

```
✅ Found it!
Location: tests/unit/README.md → "Code Constraints" section
Quote: "No switch/case statements. Use polymorphism, object maps, or conditional chains."

I should have read this before. I'll be more careful with this pattern going forward.
```

**If I DON'T find guidance:**

```
⚠️ I didn't find explicit guidance on this.

I searched:
- tests/unit/README.md
- docs/ARCHITECTURE.md
- .agents/skills/write-unit-test/SKILL.md
- ...

But found nothing about "DTO validation tests".

Should I add this lesson to tests/unit/README.md to prevent this mistake in the future? (y/n)
```

### Step 5: If Gap Exists → Prompt User

If guidance is NOT found, I propose a doc update:

```
Should I add this to tests/unit/README.md?

### DTO Validation Tests
Every DTO shape file (*.dto.shape.ts) must have a corresponding spec file 
(*.dto.shape.spec.ts) that covers:
1. Valid inputs (happy path) pass validation
2. Invalid inputs fail with correct Zod error
3. Edge cases (empty strings, max length, null values, etc.)

Location in file: After "Test structure pattern" section
Does this look right? (y/n)
```

If user says **"y"** → Proceed to Step 6
If user says **"n"** → Ask: "What should I change?" and iterate

### Step 6: Edit + Commit

I directly edit the target file:

1. **Insert** the proposed guidance at the suggested location
2. **Show full diff** to user:
   ```
   --- tests/unit/README.md (original)
   +++ tests/unit/README.md (updated)
   @@ -45,3 +45,12 @@
    ### Test structure pattern
    ...
   +### DTO Validation Tests
   +Every DTO shape file must have a test...
   ```
3. **Ask for final approval**: "Commit this change? (y/n)"
4. **If approved**: Commit with message:
   ```
   docs: add DTO validation test guidance (from write-unit-test correction)
   ```
   Message format: `docs: add [lesson] guidance (from [original-skill-or-context] correction)`

5. **If rejected**: Ask "What needs to change?" and iterate

### Step 7: Confirm Learning

```
✅ Updated tests/unit/README.md!
Committed: "docs: add DTO validation test guidance (from write-unit-test correction)"

Future write-unit-test requests will see this guidance. Mistakes prevented!
```

---

## Doc File Selection Logic

When proposing a doc update, I target the MOST RELEVANT file:

| Correction Type | Primary Target | Why | Secondary Option |
|---|---|---|---|
| Unit test patterns | `tests/unit/README.md` | Specific to unit tests | `.agents/skills/write-unit-test/SKILL.md` |
| Acceptance test patterns | `tests/acceptance/README.md` | Specific to acceptance tests | `.agents/skills/write-acceptance-test/SKILL.md` |
| Faketory patterns | `tests/shared/utils/faketories/README.md` | Specific to faketories | `.agents/skills/create-faketory/SKILL.md` |
| Mock patterns | `tests/unit/utils/mocks/README.md` | Specific to mocks | `.agents/skills/create-mock/SKILL.md` |
| Architecture / layers | `docs/ARCHITECTURE.md` | Cross-cutting concern | `AGENTS.md` |
| Code constraints (no switch, naming) | `AGENTS.md` section "Code Style" | Broad rules | `docs/ARCHITECTURE.md` |
| Domain patterns (predicates, policies) | `docs/ARCHITECTURE.md` section "Domain Patterns" | Domain-specific | Relevant skill file |
| Skill-specific anti-patterns | `.agents/skills/[skill]/SKILL.md` section "Anti-patterns" | Skill-specific | Relevant doc file |

**If I'm unsure**, I ask you:
```
Should this go in:
1. tests/unit/README.md (Unit test specific)
2. AGENTS.md (General code rule)

Which? (1/2)
```

---

## `/update-docs` Command (Explicit Learning)

Users can explicitly tell me to update docs when they DON'T want to run a skill first:

```bash
/update-docs
```

I prompt you:

```
What lesson should I document? 
(e.g., "Mappers should never have side effects")
```

You describe a lesson, and I:
1. Search docs for related content
2. Find the best file to update
3. Propose an addition to that file
4. Show diff
5. Commit if you approve

**Example:**

```
/update-docs

Me: What lesson should I document?
You: Mappers must be pure with no side effects or I/O calls

Me: I found "Mappers" section in docs/ARCHITECTURE.md.
    Should I add:
    
    **Purity constraint**: Mappers must be pure functions — no side effects, 
    no external API calls, no database access, no I/O operations. 
    Map data only.
    
    Commit this? (y/n)
```

---

## Correction Detection Examples

### ✅ Detected as Corrections

```
User: "This violates the no-switch rule. Fix it."
Me: ✅ Detected correction (keyword: "violates", "rule", "fix")
```

```
User: "Where's the DTO validation test? That's required."
Me: ✅ Detected correction (keywords: "where's", "required")
```

```
User: "This is an anti-pattern according to AGENTS.md."
Me: ✅ Detected correction (keyword: "anti-pattern")
```

```
User: "The mapper is calling an API — that's a side effect. Fix it."
Me: ✅ Detected correction (keywords: "side effect", "fix")
```

### ❓ Uncertain (Ask User)

```
User: "I'm not sure about this approach."
Me: Is this a correction I should learn from? (y/n)
```

```
User: "Interesting. Maybe there's a better way?"
Me: Is this suggesting a correction or just a question? (y/n)
```

### ❌ Not Detected as Corrections

```
User: "This looks good."
Me: (No auto-learn triggered — this is approval, not correction)
```

```
User: "Can you also add X?"
Me: (This is a feature request, not a correction of what I did)
```

---

## Diff Review & Safety

Before committing ANY change, I:

1. **Show full diff** — User sees exactly what's being added/changed
2. **Require explicit approval** — User must say "y" to proceed
3. **Never auto-commit** — All edits require human confirmation
4. **Provide rollback path** — If bad docs are committed, user can `git revert <commit>`

Safety principle: **User is always in control. I propose; you approve.**

---

## Anti-patterns & Pitfalls

### ❌ Don't: Duplicate guidance across files

**Bad:**
```
Write the same rule in tests/unit/README.md AND .agents/skills/write-unit-test/SKILL.md
```

**Good:**
```
- Write comprehensive guidance in tests/unit/README.md
- In .agents/skills/write-unit-test/SKILL.md, reference it: "See tests/unit/README.md section X"
```

### ❌ Don't: Add contradictory guidance

**Before I commit**, I should warn:
```
⚠️ I found conflicting guidance:
- AGENTS.md says: "Use const instead of let"
- But docs/ARCHITECTURE.md seems to allow let in some cases

Should I also update docs/ARCHITECTURE.md to clarify? (y/n)
```

### ❌ Don't: Update the wrong file

Ask user if unsure:
```
Should this go in:
1. tests/unit/README.md (Unit test specific)
2. docs/ARCHITECTURE.md (General architecture)

Which? (1/2)
```

### ❌ Don't: Hallucinate new guidance

Only add guidance based on:
1. Real corrections user just provided
2. Lessons user explicitly asked me to document via `/update-docs`

Don't invent new best practices I haven't been taught.

---

## Checklist

Before finishing auto-learn workflow:

- ✅ Correction was detected correctly (or user confirmed via "y/n" prompt)
- ✅ I searched all relevant doc files
- ✅ If guidance found: I confirmed learning clearly
- ✅ If gap detected: I proposed a specific addition (not vague)
- ✅ Proposed text is aligned with project style and conventions
- ✅ I showed full diff to user before committing
- ✅ User confirmed approval before commit
- ✅ Commit message includes original correction context
- ✅ Notification confirms what was learned and why it matters

---

## Reference

### Related skills

- `challenge-plan` — Use when designing new features
- `write-unit-test` — Creates tests (auto-learn catches anti-patterns here)
- `write-acceptance-test` — Creates acceptance tests
- `create-faketory` — Creates test data factories

### Key documentation

- `docs/ARCHITECTURE.md` — Mappers, domain patterns, data flow
- `tests/unit/README.md` — Unit test conventions
- `AGENTS.md` — Code style, naming, constraints
- `tests/shared/utils/faketories/README.md` — Faketory patterns
- `tests/unit/utils/mocks/README.md` — Mock patterns

### Git commands I use

```bash
# Stage all changes
git add -A

# Commit with auto-learn context
git commit -m "docs: add [lesson] guidance (from [correction-context] correction)"

# Show diff before commit
git diff --staged

# Revert if needed
git revert <commit>
```
