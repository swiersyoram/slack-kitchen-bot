import {Manifest} from "deno-slack-sdk/mod.ts";
import {menuWorkflow} from "./workflows/menuWorkflow.ts";
import {eventWorkflow} from "./workflows/eventWorkflow.ts";
import channelSettingsDataStore from "./datastores/channelSettingsStore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
    name: "coffee walk bot",
    displayName: "Coffee walk bot",
    description: "This bot will put 3 people together in a channel to have a drink and get to know each other, every month.",
    icon: "assets/app_icon.png",
    workflows: [menuWorkflow, eventWorkflow],
    datastores: [channelSettingsDataStore],
    outgoingDomains: [],
    botScopes: [
        "commands",
        "chat:write",
        "chat:write.public",
        "channels:read",
        "channels:manage",
        "groups:read",
        "groups:write",
        "mpim:read",
        "mpim:write",
        "im:read",
        "im:write",
        "datastore:read",
        "datastore:write",
        "triggers:read",
        "triggers:write"
    ],
});
