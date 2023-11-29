import {Trigger} from "deno-slack-api/types.ts";
import {kitchenWorkFlow} from "../workflows/message_workflow.ts";
import {TriggerContextData, TriggerTypes} from "deno-slack-api/mod.ts";

const sampleTrigger: Trigger<typeof kitchenWorkFlow.definition> = {
    type: TriggerTypes.Shortcut,
    name: "Kitchen duty",
    description: "Interact with the kitchen duty bot",
    workflow: "#/workflows/kitchen_workflow",
    inputs: {},
};

export default sampleTrigger;