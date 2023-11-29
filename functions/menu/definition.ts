import {DefineFunction} from "deno-slack-sdk/functions/definitions/slack-function.ts";
import {Schema} from "deno-slack-sdk/mod.ts";

export const menuFunctionDefinition = DefineFunction({
    callback_id: "kitchen-duty-menu",
    title: "Kitchen duty menu",
    source_file: "functions/menu/handler.ts",
    input_parameters: {
        properties: {interactivity: {type: Schema.slack.types.interactivity},channel: {type: Schema.slack.types.channel_id}},
        required: ["interactivity", "channel"],
    },
    output_parameters: {
        properties: {excludedUsers: {type: Schema.types.array, items:{type:Schema.slack.types.user_id}}, startTime: {type: Schema.types.number}, channel: {type: Schema.slack.types.channel_id}},
        required: ["excludedUsers", "channel", "startTime"]},
});