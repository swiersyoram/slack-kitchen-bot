import {DefineFunction} from "deno-slack-sdk/functions/definitions/slack-function.ts";
import {Schema} from "deno-slack-sdk/mod.ts";

export const sendMessageDefinition = DefineFunction({
    callback_id: "kitchen_function",
    title: "Generate a greeting",
    description: "Generate a greeting",
    source_file: "functions/send_message/handler.ts",
    input_parameters:{
        properties: {channel: {type: Schema.slack.types.channel_id}},
        required: ["channel"],
    }
});