import {DefineFunction} from "deno-slack-sdk/functions/definitions/slack-function.ts";
import {Schema} from "deno-slack-sdk/mod.ts";

export const createRotationDefinition = DefineFunction({
    callback_id: "create_rotation",
    title: "create rotation",
    source_file: "functions/create_rotation/handler.ts",
    input_parameters: {
        properties: {excludedUsers: {type: Schema.types.array, items:{type:Schema.slack.types.user_id} }, startTime: {type: Schema.types.number}, channel: {type: Schema.slack.types.channel_id}},
        required: ["excludedUsers", "channel", "startTime"]
    },
});