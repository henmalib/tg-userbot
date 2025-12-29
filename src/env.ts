import { z } from "zod";
import { CommandReturnType } from "./command.helper.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const r = z
    .object({
        API_ID: z.coerce.number(),
        API_HASH: z.string(),
    })
    .safeParse(process.env);

if (!r.success) {
    throw new Error(`Invalid env:\n${z.prettifyError(r.error)}`);
}

export const env = r.data;

const configFile = JSON.parse(
    readFileSync(join(import.meta.dirname, "../config.json"), "utf8"),
);

const cfg = z
    .object({
        botPrefix: z.string().default(";"),
        defaultResponseType: z
            .enum(CommandReturnType)
            .default(CommandReturnType.EDIT),
    })
    .safeParse(configFile);

if (!cfg.success) {
    throw new Error(`Invalid config file:\n${z.prettifyError(cfg.error)}`);
}

export const config = cfg.data;
