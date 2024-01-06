import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { menuFunctionDefinition } from "../functions/menuFunction.ts";
import {saveMenuSettingsFunction} from "../functions/saveMenuSettingsFunction.ts";
/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
export const menuWorkflow = DefineWorkflow({
  callback_id: "menu-workflow",
  title: "menu workflow",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity }, channel: { type: Schema.slack.types.channel_id } },
    required: ["interactivity", "channel"],
  },
});

const menuValues = menuWorkflow.addStep(menuFunctionDefinition, { interactivity: menuWorkflow.inputs.interactivity, channel: menuWorkflow.inputs.channel });

menuWorkflow.addStep(saveMenuSettingsFunction, { excludedUsers: menuValues.outputs.excludedUsers, channel: menuValues.outputs.channel, startTime: menuValues.outputs.startTime });


