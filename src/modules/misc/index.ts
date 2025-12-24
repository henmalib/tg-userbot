import { defineModule } from "../../command.helper.js";
import commandHelp from "./command-help.js";
import help from "./help.js";

export default defineModule({
    name: "misc",

    commands: [help, commandHelp],
});
