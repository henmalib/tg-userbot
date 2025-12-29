import {
    Dispatcher,
    filters,
    type MessageContext,
    type NewMessageHandler,
    type UpdateFilter,
    type UpdateState,
} from "@mtcute/dispatcher";
import { config, env } from "./env.js";
import { state } from "./state.js";
import { MaybePromise, TextWithEntities } from "@mtcute/node";

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

type WithReturnType<T, R> = T extends (...args: infer A) => any
    ? (...args: A) => R
    : T;

export enum CommandReturnType {
    EDIT = "edit",
    REPLY = "reply",
    NEW = "new",
    DELETE = "delete",
    SILENT_DELETE = "silent-delete",
    SAVED_MESSAGES = "saved-message",
}

export interface CommandResult {
    type: CommandReturnType;
    text: string | TextWithEntities;
}

type HandlerForFilter<F, State = never> = WithReturnType<
    NewMessageHandler<CtxForFilter<F>, StateArg<State>>["callback"],
    MaybePromise<CommandResult>
>;

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
    events?: ReturnType<typeof defineEvent<any, any>>[];
}

// TODO: dynamically collect commands
export const defineModule = <M extends Module<any>>(m: M) => m;

export const createRegExpFilter = (command: string) => {
    const regexp = new RegExp(`^\\${config.botPrefix}${command}`, "i");

    return filters.regex(regexp);
};

export const findCommandsByName = (name: string) => {
    const commands = state.modules.flatMap((m) => m.commands);

    return commands.filter(
        (c) => c.command.toLowerCase() === name.toLowerCase(),
    );
};

export type AvaliableEvents = Extract<keyof Dispatcher<never>, `on${string}`>;

type EventHandlerType<E extends AvaliableEvents> = Parameters<
    Dispatcher<never>[E]
>[0];

type EventFilteredHandlerType<E extends AvaliableEvents> =
    Dispatcher<never>[E] extends {
        (filter: any, handler: infer H, ...args: any[]): any;
    }
        ? H
        : EventHandlerType<E>;

export interface Event<E extends AvaliableEvents, F = undefined> {
    name: E;
    filter?: F;
    handler: EventFilteredHandlerType<E>;
}

export const defineEvent = <E extends AvaliableEvents, F = undefined>(
    e: Event<E, F>,
) => e;

export const respond = (
    text: string | TextWithEntities,
    type: CommandReturnType = config.defaultResponseType,
): CommandResult => {
    return {
        text,
        type,
    };
};
