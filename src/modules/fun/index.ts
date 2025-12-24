import { defineModule } from "../../command.helper.js";
import id from "./id.js";

export default defineModule({
    name: "fun",
    description: "Just simple fun utilities that do nothing usefull",
    commands: [id],
});
