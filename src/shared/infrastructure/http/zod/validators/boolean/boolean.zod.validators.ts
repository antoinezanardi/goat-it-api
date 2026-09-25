import { z } from "zod";

import type { ZodBoolean, ZodCodec, ZodString } from "zod";

function zStringBoolean(): ZodCodec<ZodString, ZodBoolean> {
  return z.stringbool({ truthy: ["true"], falsy: ["false"] });
}

export { zStringBoolean };