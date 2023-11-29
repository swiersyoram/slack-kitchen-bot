import { Trigger } from "deno-slack-sdk/types.ts";
import menuWorkFlow from "../workflows/menu_workflow.ts";
import {TriggerContextData} from "deno-slack-api/mod.ts";


/**
 * This trigger starts the workflow when an end-user clicks the link.
 * Learn more at https://api.slack.com/future/triggers/link
 */
const trigger: Trigger<typeof menuWorkFlow.definition> = {
    type: "shortcut",
    name: "Open the kitchen duty bot menu",

    workflow: `#/workflows/${menuWorkFlow.definition.callback_id}`,
    inputs: {
        interactivity: { value: TriggerContextData.Shortcut.interactivity },
        channel: { value: TriggerContextData.Shortcut.channel_id },
    },
};

export default trigger;