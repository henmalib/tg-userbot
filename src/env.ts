import { z } from "zod";

const r = z
    .object({
        API_ID: z.coerce.number(),
        API_HASH: z.string(),

        BOT_PREFIX: z.string().default(";"),
    })
    .safeParse(process.env);

if (!r.success) {
    throw new Error(`Invalid env:\n${z.prettifyError(r.error)}`);
}

export const env = r.data;
