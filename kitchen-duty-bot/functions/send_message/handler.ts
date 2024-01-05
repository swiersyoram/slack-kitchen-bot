import { SlackFunction } from "deno-slack-sdk/mod.ts";
import {sendMessageDefinition} from "./definition.ts";
import {getMessage} from "./util.ts";

export default SlackFunction(sendMessageDefinition, async ({inputs, client}) => {
    await client.chat.postMessage({
        channel: inputs.channel,
        blocks: await getMessage(client, inputs.channel, true),
        attachments: []
    })

    return {
        outputs:{}
    }
})