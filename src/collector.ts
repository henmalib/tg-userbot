import { readdirSync } from "node:fs";
import { join } from "node:path";
import { state } from "./state.js";

export const collectModules = async () => {
    const dir = join(import.meta.dirname, "./modules");

    const moduleList = readdirSync(dir);

    const modules = await Promise.all(
        moduleList.map((m) => import(join(dir, m))),
    );

    state.modules = modules.map((m) => m.default);
};
