import {DefineWorkflow, Schema} from "deno-slack-sdk/mod.ts";
import {eventFunctionDefinition} from "../functions/eventFunction.ts";
/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
export const eventWorkflow = DefineWorkflow({
    callback_id: "event-workflow",
    title: "event workflow",
    input_parameters: {
        properties: {
            channel: { type: Schema.slack.types.channel_id },
        },
        required: ["channel"],
    },
});

eventWorkflow.addStep(eventFunctionDefinition,{channel:eventWorkflow.inputs.channel});


