import { defineModule } from "../../command.helper.js";
import id from "./id.js";
import { textreplaceAddCommand, textReplaceEvent } from "./text-replace.js";

export default defineModule({
    name: "fun",
    description: "Just simple fun utilities that do nothing usefull",
    commands: [id, textreplaceAddCommand],
    events: [textReplaceEvent],
});
