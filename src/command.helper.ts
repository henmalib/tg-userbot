import {
    filters,
    type MessageContext,
    type NewMessageHandler,
    type UpdateFilter,
    type UpdateState,
} from "@mtcute/dispatcher";
import { env } from "./env.js";
import { state } from "./state.js";

type AnyMsgFilter =
    | UpdateFilter<MessageContext, any, any>
    | UpdateFilter<MessageContext, any>
    | undefined;

type FilterMod<F> =
    F extends UpdateFilter<MessageContext, infer Mod, any>
        ? Mod
        : F extends UpdateFilter<MessageContext, infer Mod>
          ? Mod
          : never;

type CtxForFilter<F> = [F] extends [undefined]
    ? MessageContext
    : filters.Modify<MessageContext, FilterMod<F>>;

type StateArg<S> = [S] extends [never] ? never : UpdateState<S & object>;

type HandlerForFilter<F, S = never> = NewMessageHandler<
    CtxForFilter<F>,
    StateArg<S>
>["callback"];

export interface Command<F extends AnyMsgFilter = undefined, State = never> {
    command: string;
    description?: string;
    usage?: string;

    filter?: F;
    disabled?: boolean;
    handler: HandlerForFilter<F, State>;
}
export const defineCommand = <F extends AnyMsgFilter, State = never>(
    c: Command<F, State>,
) => c;

export interface Module<C extends Command> {
    name: string;
    description?: string;

    commands: C[];
}

export const defineModule = <M extends Module<any>>(m: M) => m;

export const createRegExpFilter = (command: string) => {
    const regexp = new RegExp(`^\\${env.BOT_PREFIX}${command}`, "i");

    return filters.regex(regexp);
};

export const findCommandsByName = (name: string) => {
    const commands = state.modules.flatMap((m) => m.commands);

    return commands.filter(
        (c) => c.command.toLowerCase() === name.toLowerCase(),
    );
};
