import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

import {eventWorkflow} from "../workflows/eventWorkflow.ts";

const manualEventTrigger: Trigger<typeof eventWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Create an coffee walk event",
  workflow: `#/workflows/${eventWorkflow.definition.callback_id}`,
    inputs: {
        channel: {
            value: TriggerContextData.Shortcut.channel_id,
        }
    },

};

export default manualEventTrigger;