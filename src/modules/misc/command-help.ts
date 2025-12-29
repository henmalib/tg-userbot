import { md } from "@mtcute/markdown-parser";
import {
    Command,
    createRegExpFilter,
    defineCommand,
    findCommandsByName,
    respond,
} from "../../command.helper.js";

const createCommandHelp = (commands: Command[]) => {
    const stringBuilder: string[] = [];

    for (const command of commands) {
        stringBuilder.push(
            `* **${command.usage || command.command}** - ${command.description || "No description provided"}`,
        );
    }

    return stringBuilder.join("\n");
};

export default defineCommand({
    command: "help",
    description: "Provides a help to a specific command",
    usage: "help [COMMAND]",
    filter: createRegExpFilter("help\\s+(.+)"),

    async handler(msg) {
        const commands = findCommandsByName(msg.match[1]);
        const message = createCommandHelp(commands);

        return respond(md(message));
    },
});
