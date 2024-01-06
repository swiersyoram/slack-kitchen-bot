import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

import {menuWorkflow} from "../workflows/menuWorkflow.ts";

const menuTrigger: Trigger<typeof menuWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Open the Coffee walk bot menu",
  workflow: `#/workflows/${menuWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default menuTrigger;