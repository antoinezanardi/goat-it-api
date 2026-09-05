---
description: Translate all not-fully-translated questions from French source to all other locales via the admin API.
agent: build
---

# Translate questions

## Task

Translate all not-fully-translated questions from French source to all other locales (`en`, `es`, `de`, `it`, `pt`).

- French (`fr`) is the **source of truth** and must **NEVER** be modified or included in any PATCH payload.
- With a single `PATCH /admin/questions/:id`, translate all missing locales of one question.
- The command is over when **ALL** questions are fully translated.

**IMPORTANT**: Questions MUST be translated **ONE AT A TIME**. Never batch questions. Each question must be fully processed (displayed, translated, approved by user, PATCHed, verified) before fetching and starting the next one. The reviewer must re-read each translation individually.

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
- Otherwise, store the list of questions for counting purposes, but **only fetch and process ONE question at a time** in step 4. Each question has an `id` and `content` with `statement`, `answer`, `context?`, `trivia?` — each being a localized object with optional locale keys.

### 4. Per-question translation loop

**Process ONE question at a time.** After completing all steps for a question (including verification in 4h), only then fetch the next untranslated question. Never preload or batch multiple questions.

#### 4a. Display French source

Show the user the French content for this question:

| Field       | French (`fr`)                                |
|-------------|----------------------------------------------|
| `statement` | `{question.content.statement.fr}`            |
| `answer`    | `{question.content.answer.fr}`               |
| `context`   | `{question.content.context.fr}` (if present) |
| `trivia`    | `{question.content.trivia.fr}` (if present)  |

#### 4b. Identify missing locales

For each content field (`statement`, `answer`, `context`, `trivia`), determine which of the 5 target locales (`en`, `es`, `de`, `it`, `pt`) are missing (value is `null` or key is absent).

- **Mandatory fields** (`statement`, `answer`): all 5 target locales must be filled.
- **Optional fields** (`context`, `trivia`): translate only if the French source is non-null. If French is null, skip that field entirely.

#### 4c. Generate English translation

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

#### 4d. Wait for user approval

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

- If **Reject** → ask the user what to do via `question` tool: `["Skip this question", "Provide manual English translation", "Halt command"]`.
  - **Skip**: move to the next question.
  - **Manual**: user provides the English translations; use those instead.
  - **Halt**: stop the entire command.
- If **Approve** → proceed to step 4e.

#### 4e. Auto-translate to remaining locales

Using the approved English translation as a reference alongside the French source, generate translations for `es`, `de`, `it`, `pt` for all fields identified in step 4b.

Apply the same translation rules as step 4c.

#### 4f. PATCH the question

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
      "en": [
        "..."
      ],
      "es": [
        "..."
      ],
      "de": [
        "..."
      ],
      "it": [
        "..."
      ],
      "pt": [
        "..."
      ]
    }
  }
}
```

Execute the PATCH:

```bash
curl -s -X PATCH "{baseUrl}/admin/questions/{questionId}" \
  -H "Content-Type: application/json" \
  -H "goat-it-api-key: {apiKey}" \
  -d '{payload}'
```

#### 4g. Handle errors

If the PATCH returns a non-`200` status:

- Display the full response body and status code to the user.
- Ask via `question` tool: `["Retry with modified translations", "Skip this question", "Halt command"]`.
  - **Retry**: go back to step 4c with the error context.
  - **Skip**: move to the next question.
  - **Halt**: stop the entire command.

#### 4h. Verify translation completeness

Re-fetch the question to confirm it is now fully translated:

```bash
curl -s "{baseUrl}/admin/questions/{questionId}" \
  -H "goat-it-api-key: {apiKey}" \
  -H "Accept: application/json"
```

Check that all mandatory fields (`statement`, `answer`) have non-null values for all 6 locales (`fr`, `en`, `es`, `de`, `it`, `pt`). If optional fields were translated, verify those too.

- If still incomplete → display which locales/fields are missing, then ask the user via `question` tool with options: `["Retry", "Skip", "Halt"]`.
  - **Retry**: go back to step 4c, regenerate translations for the missing fields/locales, then re-PATCH and re-verify.
  - **Skip**: record this question as skipped (with reason: "incomplete after patch"), output `✗ Question {id} skipped (incomplete)`, and move to the next question.
  - **Halt**: record this question as halted (with reason: "incomplete after patch"), output `✗ Question {id} halted (incomplete)`, and stop the entire command.
  Record the selected outcome (and question ID) in a running list of issues to include in the final summary.
- If complete → output `✓ Question {id} fully translated` and move to the next question.

### 5. Completion

When all questions have been processed, output a summary.

**If all questions were successfully translated (no skips, no halts, no errors):**

```
Translation complete.

Questions translated: {count}
Locales: en, es, de, it, pt (source: fr, untouched)
Issues: none
```

**If any questions were skipped or had errors:**

```
Translation partial.

Questions translated: {successfully_translated_count} / {total_count}
Locales: en, es, de, it, pt (source: fr, untouched)
Issues: {count}
```

Then list each problematic question with its ID and reason:

```
- {questionId}: skipped (reason: {reason})
- {questionId}: halted (reason: {reason})
- {questionId}: error (reason: {reason})
```
