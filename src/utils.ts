import { MessageContext } from "@mtcute/dispatcher";

export const getAffectedUser = async (msg: MessageContext) => {
    const reply = await msg.getReplyTo();
    if (reply) return reply.sender.id;

    const userPing = msg.text.match(/@[\w\d]+/);
    if (!userPing) return undefined;

    const user = await msg.client.getUser(userPing[0]);
    return user.id;
};
