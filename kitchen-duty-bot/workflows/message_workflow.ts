import {DefineWorkflow, Schema} from "deno-slack-sdk/mod.ts";
import {sendMessageDefinition} from "../functions/send_message/definition.ts";


const messageWorkFlow = DefineWorkflow({
  callback_id: "message_workflow",
  title: "Send dishwasher duty message",
  description: "Display a list of people who are on dishwasher duty this week",
  input_parameters: {
    properties: { channel: { type: Schema.slack.types.channel_id } },
    required: [ "channel"],
  },
});

messageWorkFlow.addStep(
    sendMessageDefinition,{ channel: messageWorkFlow.inputs.channel}
);


export default messageWorkFlow;