import { Command, Module } from "./command.helper.js";

interface State {
    modules: Module<Command>[];
}

export const state: State = {
    modules: [],
};
