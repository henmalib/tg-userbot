import { md } from "@mtcute/markdown-parser";
import {
    Command,
    createRegExpFilter,
    defineCommand,
} from "../../command.helper.js";
import { state } from "../../state.js";

const createCommandDisplayValue = (command: string, amount: number) => {
    if (amount <= 1) {
        return command;
    }

    return `${command} (${amount})`;
};

const createHelp = () => {
    const stringBuilder = [`Avaliable Modules:`];

    for (const module of state.modules) {
        stringBuilder.push(
            `**${module.name}** - ${module.description || "No description provided"}`,
        );

        const commands: Record<string, Command & { amount: number }> = {};

        for (const command of module.commands) {
            let cmd = commands[command.command];

            if (cmd) {
                cmd.amount += 1;
            } else {
                cmd = command as any;
                cmd.amount = 1;
            }

            commands[command.command] = cmd;
        }

        stringBuilder.push(
            `\`\`\`\n${Object.values(commands)
                .map((c) => createCommandDisplayValue(c.command, c.amount))
                .join(", ")}\n\`\`\``,
        );
    }

    return stringBuilder.join("\n");
};

export default defineCommand({
    command: "help",
    filter: createRegExpFilter("help$"),
    description: "Provides a list of modules with commands avaliable",

    async handler(msg) {
        const message = createHelp();

        await msg.edit({
            text: md(message),
        });
    },
});
