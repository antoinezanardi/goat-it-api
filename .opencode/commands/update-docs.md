---
description: Explicitly tell AI to search docs and update them based on a lesson you want to teach.
agent: build
---

Load the `auto-learn` skill and follow its "Step 3 onwards" workflow for explicit doc updates.

Prompt the user to describe a lesson (e.g., "Mappers should never have side effects"), then search docs for related content, propose an addition to the most relevant file, show the diff, and commit if the user approves.

The lesson provided: $ARGUMENTS
