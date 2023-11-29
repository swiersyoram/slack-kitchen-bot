import { Manifest } from "deno-slack-sdk/mod.ts";

import menuWorkFlow from "./workflows/menu_workflow.ts";
import kitchDutyStore from "./datastores/kitch-duty-store.ts";
import messageWorkFlow from "./workflows/message_workflow.ts";


/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Kitchen duty bot",
  displayName: "Kitchen duty bot",
  backgroundColor: "#2878b9",
  description:
    "This bot will generate a list of people who are on dishwasher duty this week",
  icon: "assets/logo.png",
  datastores: [kitchDutyStore],
  workflows: [messageWorkFlow, menuWorkFlow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public", "users:read", "usergroups:read", "channels:read","groups:read","mpim:read","im:read", "triggers:write" , "datastore:read", "datastore:write"],

  features:{
    appHome: {
      messagesTabEnabled: true,
      messagesTabReadOnlyEnabled: false,
    }
  }
});
