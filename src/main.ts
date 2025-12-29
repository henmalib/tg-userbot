import { Dispatcher, filters } from "@mtcute/dispatcher";
import { md, TelegramClient, TextWithEntities } from "@mtcute/node";

import { env, config } from "./env.js";
import { collectModules } from "./collector.js";
import { state } from "./state.js";
import { Command, CommandReturnType, Event } from "./command.helper.js";

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: "bot-data/session",
});

const switchHelper = (x: never) => {};

const dp = Dispatcher.for(tg);

await collectModules();
const registerCommand = (command: Command) => {
    dp.onNewMessage(
        filters.and(
            // @ts-ignore it can't infer handler type, hance an error
            ...[filters.me, filters.outgoing, command.filter].filter(Boolean),
        ),
        async (msg, ...args) => {
            let type: CommandReturnType = config.defaultResponseType;
            let text: string | TextWithEntities = "";

            try {
                const response = await command.handler(msg, ...args);

                type = response.type;
                text = response.text;
            } catch (e) {
                if (e instanceof Error) {
                    if (!("message" in e)) {
                        console.error(e);
                    }

                    text = md(
                        `There's an error while running a command:\n\`\`\`\n${"message" in e ? e.message : "Unknown error, please see logs"}\n\`\`\``,
                    );
                } else {
                    console.error(e);
                    text = md(
                        "There's an error while running a command:\n\`\`\`\nUnknown error, please see logs\n\`\`\`",
                    );
                }
            }

            switch (type) {
                case CommandReturnType.EDIT:
                    await msg.edit({ text });
                    break;

                case CommandReturnType.REPLY:
                    await msg.replyText(text);
                    break;

                case CommandReturnType.NEW:
                    await msg.client.sendText(msg.chat.id, text);
                    break;

                case CommandReturnType.SILENT_DELETE:
                    await msg.edit({
                        text: "a",
                    });
                case CommandReturnType.DELETE:
                    await msg.delete();
                    break;

                case CommandReturnType.SAVED_MESSAGES:
                    await msg.client.sendText("me", text);
                    return;

                default:
                    switchHelper(type);
            }
        },
    );
};

const registerEvent = (event: Event<any, any>) => {
    // I do love some js shit :fire:

    if (event.filter) {
        // @ts-ignore
        dp[event.name](event.filter, event.handler);
    } else {
        // @ts-ignore
        dp[event.name](event.handler);
    }
};

console.log("Collected Modules:");

for (const module of state.modules) {
    console.log(`- ${module.name}`);

    for (const event of module.events || []) {
        console.log(`  > ${event.name}`);
    }

    for (const command of module.commands) {
        console.log(`  * ${command.command}`);
    }
}

state.modules.flatMap((c) => c.commands).forEach((c) => registerCommand(c));
state.modules.flatMap((c) => c.events || []).forEach((c) => registerEvent(c));

const user = await tg.start();
console.log("Logged in as", user.username);
