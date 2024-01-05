import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import {menuFunctionDefinition} from "../functions/menu/definition.ts";
import {createRotationDefinition} from "../functions/create_rotation/definition.ts";


const menuWorkFlow = DefineWorkflow({
    callback_id: "menu-workflow",
    title: "menu workflow",
    input_parameters: {
        properties: { interactivity: { type: Schema.slack.types.interactivity }, channel: { type: Schema.slack.types.channel_id } },
        required: ["interactivity", "channel"],
    },
});

const form = menuWorkFlow.addStep(menuFunctionDefinition, { interactivity: menuWorkFlow.inputs.interactivity, channel: menuWorkFlow.inputs.channel})

menuWorkFlow.addStep(createRotationDefinition,{"excludedUsers":form.outputs.excludedUsers, "channel":form.outputs.channel,"startTime":form.outputs.startTime })

export default menuWorkFlow;