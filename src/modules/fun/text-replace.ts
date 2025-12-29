import { filters } from "@mtcute/dispatcher";
import {
    CommandReturnType,
    createRegExpFilter,
    defineCommand,
    defineEvent,
    respond,
} from "../../command.helper.js";

// TODO: implement storing/loading them

export type TextReplaceRule = {
    to: string;
    replaceType?: "replace" | "replaceAll";
} & (
    | {
          type: "string";
          from: string;
      }
    | {
          type: "regexp";
          from: RegExp;
          flags: string;
      }
);

const rules: TextReplaceRule[] = [
    {
        type: "regexp",
        flags: "ig",
        from: /\/bam/gi,
        to: "/ban",
    },
];

export const textreplaceAddCommand = defineCommand({
    command: "textreplace",
    usage: "textreplace add",
    description: "Adds a textreplace rule",
    filter: createRegExpFilter("textreplace\\s+add"),

    async handler(msg) {
        return respond("TODO");
    },
});

export const textReplaceEvent = defineEvent({
    name: "onNewMessage",
    filter: filters.outgoing,
    handler: async (msg) => {
        let text = msg.text;

        for (const rule of rules) {
            text = text[rule.replaceType || "replace"](rule.from, rule.to);
        }

        if (text !== msg.text) {
            await msg.edit({
                text,
            });
        }
    },
});
