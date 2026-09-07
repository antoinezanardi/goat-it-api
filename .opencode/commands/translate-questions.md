---
description: Translate all not-fully-translated questions from French source to all other locales via the admin API, or mark them as French-only via applicableLocales when translation is not relevant.
agent: build
---

# Translate questions

## Task

For each question that is not fully translated, either translate it from French (`fr`) to all other locales (`en`, `es`, `de`, `it`, `pt`) **or** mark it as French-only via `applicableLocales: ["fr"]` when translation is not relevant.

- French (`fr`) is the **source of truth** and must **NEVER** be modified or included in any PATCH payload.
- With a single `PATCH /admin/questions/:id`:
  - Translate all missing locales of one question (`content` payload), **OR**
  - Set `applicableLocales: ["fr"]` to restrict the question to French only (no content translation needed).
- The command is over when **ALL** questions are either fully translated OR have `applicableLocales` restricting them to `["fr"]`.

**IMPORTANT**: Questions MUST be processed **ONE AT A TIME**. Never batch questions. Each question must be fully processed (displayed, decided, PATCHed, verified) before fetching and starting the next one. The reviewer must re-read each translation individually.

**Marking as French-only** is appropriate when translation would not be relevant. Examples:
- **Lexicon questions** — the answer is a French-specific term; would be too easy or meaningless in another language.
- **French-culture questions** — content is too tied to French culture to be meaningful for non-French players.
- **Puns, wordplay, or jokes** — French-language specific humor that does not translate.

## Instructions

### 1. Get API credentials

Ask the user for the API base URL and admin API key via the `question` tool:

1. Ask for the **base URL** (e.g., `http://localhost:3000`, `https://api.staging.goat-it.fr` or `https://api.goat-it.fr`).
2. Ask for the **admin API key** (the `goat-it-api-key` header value).

Store both values for subsequent requests.

### 2. Verify connectivity

Run a connectivity check against the admin API:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "{baseUrl}/admin/questions?limit=1" \
  -H "goat-it-api-key: {apiKey}" \
  -H "Accept: application/json"
```

- If HTTP status is **not** `200` → report the error to the user. **Go back to step 1** and ask for the URL and API key again. Repeat until connectivity succeeds or the user explicitly halts.
- If `200` → proceed.

### 3. Fetch untranslated questions

```bash
curl -s "{baseUrl}/admin/questions?is-fully-translated=false&limit=100&sort-by=createdAt&sort-order=asc" \
  -H "goat-it-api-key: {apiKey}" \
  -H "Accept: application/json"
```

- If the response is an **empty array** → output "All questions are fully translated." and stop.
- Otherwise, store the list of questions for counting purposes, but **only fetch and process ONE question at a time** in step 4. Each question has an `id`, `category`, `applicableLocales`, and `content` with `statement`, `answer`, `context?`, `trivia?` — each being a localized object with optional locale keys.

> Note: `is-fully-translated=false` already accounts for `applicableLocales`. A question with `applicableLocales: ["fr"]` and French content for mandatory fields is **excluded** from this list (considered fully handled).

### 4. Per-question translation loop

**Process ONE question at a time.** After completing all steps for a question (including verification in 4i), only then fetch the next untranslated question. Never preload or batch multiple questions.

#### 4a. Display French source

Show the user the French content for this question:

| Field                | Value                                                       |
|----------------------|-------------------------------------------------------------|
| `category`           | `{question.category}`                                       |
| `statement`          | `{question.content.statement.fr}`                           |
| `answer`             | `{question.content.answer.fr}`                              |
| `context`            | `{question.content.context.fr}` (if present)                |
| `trivia`             | `{question.content.trivia.fr}` (if present)                 |
| `applicableLocales`  | `{question.applicableLocales ?? []}` (current restriction; `[]`/undefined = all locales) |

#### 4b. Identify missing locales

For each content field (`statement`, `answer`, `context`, `trivia`), determine which of the 5 target locales (`en`, `es`, `de`, `it`, `pt`) are missing (value is `null` or key is absent).

- **Mandatory fields** (`statement`, `answer`): all 5 target locales must be filled.
- **Optional fields** (`context`, `trivia`): translate only if the French source is non-null. If French is null, skip that field entirely.

#### 4c. Decide how to proceed

Ask the user via the `question` tool how to handle this question:

Options: `["Translate to all missing locales", "Mark as French-only (applicableLocales = [fr])", "Skip this question", "Halt command"]`

- **Translate to all missing locales** → continue to step 4d.
- **Mark as French-only** → skip translation; jump directly to step 4g (case 2) to PATCH `applicableLocales: ["fr"]`.
- **Skip this question** → record `{questionId}: skipped (reason: skipped by user)` in the running issues list, output `✗ Question {questionId} skipped (skipped by user)`, and move to the next question.
- **Halt command** → stop the entire command.

When choosing "Mark as French-only", the command will not translate content; the question will only be visible to French players. Use this option when:
- The question is a **lexicon** one (the answer is a French-specific term that would lose meaning in another language).
- The question is **deeply tied to French culture** that cannot be meaningfully adapted for non-French players.
- The question relies on **puns, wordplay, or jokes** that do not translate.

#### 4d. Generate English translation

Translate the French content to English for all fields that need it:

- `statement.fr` → `statement.en`
- `answer.fr` → `answer.en`
- `context.fr` → `context.en` (if French context exists)
- `trivia.fr` → `trivia.en` (if French trivia exists)

Translation rules:

- Preserve meaning, tone, and cultural context. Cultural adaptation over literal translation.
- Keep placeholder structures intact (e.g., `{name}`, `{count}`, `{{variable}}`).
- For `trivia` arrays, translate each element individually.
- Keep proper nouns, brand names, and game-specific terminology consistent.

#### 4e. Wait for user approval

Present the English translations to the user via the `question` tool:

```
Question {id} — English translation proposal:

Statement (fr): {french statement}
Statement (en): {proposed english statement}

Answer (fr): {french answer}
Answer (en): {proposed english answer}

Context (fr): {french context}
Context (en): {proposed english context}  (if present)

Trivia (fr): {french trivia}
Trivia (en): {proposed english trivia}    (if present)
```

Options: `["Approve", "Reject"]`

- If **Reject** → ask the user what to do via `question` tool: `["Mark as French-only (skip translation)", "Provide manual English translation", "Skip this question", "Halt command"]`.
  - **Mark as French-only**: jump directly to step 4g (case 2) to PATCH `applicableLocales: ["fr"]`.
  - **Manual**: user provides the English translations; use those instead, then continue at step 4f.
  - **Skip**: record `{questionId}: skipped (reason: skipped by user during approval)` in the running issues list, output `✗ Question {questionId} skipped (skipped by user during approval)`, and move to the next question.
  - **Halt**: stop the entire command.
- If **Approve** → proceed to step 4f.

#### 4f. Auto-translate to remaining locales

Using the approved English translation as a reference alongside the French source, generate translations for `es`, `de`, `it`, `pt` for all fields identified in step 4b.

Apply the same translation rules as step 4d.

#### 4g. PATCH the question

Two cases depending on the decision made in step 4c or 4e:

**Case 1: Translating** (after step 4f)

Build the PATCH payload. **Only include fields and locales that were missing.** Never include `fr`.

Example payload (if only `statement` and `answer` needed translation):

```json
{
  "content": {
    "statement": {
      "en": "...",
      "es": "...",
      "de": "...",
      "it": "...",
      "pt": "..."
    },
    "answer": {
      "en": "...",
      "es": "...",
      "de": "...",
      "it": "...",
      "pt": "..."
    }
  }
}
```

Example payload (if `context` and `trivia` also need translation):

```json
{
  "content": {
    "statement": {
      "en": "...",
      "es": "...",
      "de": "...",
      "it": "...",
      "pt": "..."
    },
    "answer": {
      "en": "...",
      "es": "...",
      "de": "...",
      "it": "...",
      "pt": "..."
    },
    "context": {
      "en": "...",
      "es": "...",
      "de": "...",
      "it": "...",
      "pt": "..."
    },
    "trivia": {
      "en": ["..."],
      "es": ["..."],
      "de": ["..."],
      "it": ["..."],
      "pt": ["..."]
    }
  }
}
```

Execute the PATCH and capture both the response body and the HTTP status code (printed on the last line via -w):

```bash
curl -s -X PATCH "{baseUrl}/admin/questions/{questionId}" \
  -H "Content-Type: application/json" \
  -H "goat-it-api-key: {apiKey}" \
  -d '{payload}' \
  -w "\n%{http_code}"
```

**Case 2: Marking as French-only** (from step 4c or 4e reject)

Send only the `applicableLocales` field:

```json
{
  "applicableLocales": ["fr"]
}
```

Execute the PATCH and capture both the response body and the HTTP status code (printed on the last line via -w):

```bash
curl -s -X PATCH "{baseUrl}/admin/questions/{questionId}" \
  -H "Content-Type: application/json" \
  -H "goat-it-api-key: {apiKey}" \
  -d '{"applicableLocales": ["fr"]}' \
  -w "\n%{http_code}"
```

#### 4h. Handle errors

If the PATCH returns a non-`200` status:

- Display the full response body and status code to the user.
- Ask via `question` tool: `["Retry", "Mark as French-only", "Skip this question", "Halt command"]`.
  - **Retry**: go back to step 4d (translation case) or step 4g case 2 (French-only case) with the error context.
  - **Mark as French-only** (translation case only): switch to step 4g case 2.
  - **Skip**: record `{questionId}: skipped (reason: skipped by user after PATCH error)` in the running issues list, output `✗ Question {questionId} skipped (skipped by user after PATCH error)`, and move to the next question.
  - **Halt**: stop the entire command.

#### 4i. Verify question is fully handled

Re-fetch the question to confirm it is now fully handled:

```bash
curl -s "{baseUrl}/admin/questions/{questionId}" \
  -H "goat-it-api-key: {apiKey}" \
  -H "Accept: application/json"
```

**For translation case:** Check that all mandatory fields (`statement`, `answer`) have non-null values for all 6 locales (`fr`, `en`, `es`, `de`, `it`, `pt`). If optional fields were translated, verify those too.

**For French-only case:** Check that `applicableLocales` is now exactly `["fr"]`.

- If still incomplete → display which locales/fields (or `applicableLocales`) are missing, then ask the user via `question` tool with options: `["Retry", "Skip", "Halt"]`.
  - **Retry**: go back to step 4d (translation case) or step 4g case 2 (French-only case), re-PATCH and re-verify.
  - **Skip**: record this question as skipped (with reason: "incomplete after patch"), output `✗ Question {id} skipped (incomplete)`, and move to the next question.
  - **Halt**: record this question as halted (with reason: "incomplete after patch"), output `✗ Question {id} halted (incomplete)`, and stop the entire command.
  Record the selected outcome (and question ID) in a running list of issues to include in the final summary.
- If complete → output `✓ Question {id} fully translated` (translation case) or `✓ Question {id} marked as French-only` (French-only case), increment `translated_count` (translation case) or `french_only_count` (French-only case) by exactly 1, then move to the next question.

### 5. Completion

When all questions have been processed, output a summary.

**If all questions were successfully handled (no skips, no halts, no errors):**

```
Translation complete.

Questions translated: {translated_count}
Questions marked as French-only: {french_only_count}
Locales: en, es, de, it, pt (source: fr, untouched)
Issues: none
```

**If any questions were skipped or had errors:**

```
Translation partial.

Questions translated: {translated_count} / {total_count}
Questions marked as French-only: {french_only_count} / {total_count}
Locales: en, es, de, it, pt (source: fr, untouched)
Issues: {count}
```

Then list each problematic question with its ID and reason:

```
- {questionId}: skipped (reason: {reason})
- {questionId}: halted (reason: {reason})
- {questionId}: error (reason: {reason})
```

### 6. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command**:

1. **Collect findings** from the session:
   - Translations the user accepted as-is or rewrote manually (candidate style entries: tone, terminology, locale conventions).
   - Decisions to mark questions as French-only that the user later reversed (candidate heuristic entries: when to suggest French-only proactively).
   - Per-question choices the user rejected (translate vs French-only vs skip) and the reasoning they gave.
   - Loop friction: ambiguous wording, misleading verification outputs, partial API responses that the agent had to re-interpret.
   - Any explicit user feedback during approval questions or issue reviews.
2. **Propose improvements** — map each finding to a concrete edit of `.opencode/commands/translate-questions.md` (step wording, verification logic, summary format, locale list, French-only heuristics). Present them as a table: improvement → lessons addressed, then ask via the question tool which to apply.
3. **Never modify the command without explicit user approval.**
4. **Apply approved edits** directly, verify each landed by re-reading/grepping the edited sections, and report where each change lives.

Skip this step only when the user explicitly closes the session first; otherwise always offer it.