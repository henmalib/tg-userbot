import { md } from "@mtcute/markdown-parser";
import {
    createRegExpFilter,
    defineCommand,
    respond,
} from "../../command.helper.js";
import { getAffectedUser } from "../../utils.js";

export default defineCommand({
    command: "id",
    description: "Provides an id of current chat and/or user",
    usage: "id <user>",
    filter: createRegExpFilter("id"),

    async handler(msg) {
        const user = await getAffectedUser(msg);

        const builder = [`Current ChatId: \`${msg.chat.id}\``];
        if (user) {
            builder.push(`Affected UserId: \`${user}\``);
        }

        return respond(md(builder.join("\n")));
    },
});
