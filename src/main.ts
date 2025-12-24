import { Dispatcher, filters } from "@mtcute/dispatcher";
import { TelegramClient } from "@mtcute/node";

import { env } from "./env.js";
import { collectModules } from "./collector.js";
import { state } from "./state.js";
import { Command } from "./command.helper.js";

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: "bot-data/session",
});

const dp = Dispatcher.for(tg);

await collectModules();
const registerCommand = (command: Command) => {
    dp.onNewMessage(
        // @ts-ignore it can't infer handler type, hance an error
        filters.and(...[filters.me, command.filter].filter(Boolean)),
        command.handler,
    );
};

console.log("Collected Modules:");

for (const module of state.modules) {
    console.log(`- ${module.name}`);

    for (const command of module.commands) {
        console.log(`  * ${command.command}`);

        registerCommand(command);
    }
}

const user = await tg.start();
console.log("Logged in as", user.username);
