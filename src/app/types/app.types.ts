import type { APP_METADATA_SCHEMA } from "@app/types/app.constants";

import type { z } from "zod";

type AppMetadata = z.infer<typeof APP_METADATA_SCHEMA>;

export type { AppMetadata };