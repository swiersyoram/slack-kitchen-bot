import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";

/**
 * Datastores are a Slack-hosted location to create_rotation
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
const KitchenDutyDatastore = DefineDatastore({
  name: "kitchenDuty",
  primary_key: "channel",
  attributes: {
    rotation_trigger_id: {
      type: Schema.types.string,
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    excluded: {
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.user_id,
      },
    },
    start_time: {
      type: Schema.types.number,
    },
    iteration:{
        type: Schema.types.number,
    },
    last_rotation:{
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.user_id,
      },
    }
  },
});

// Utility type of a rotation item
export type KitchenDutyRotation = DatastoreItem<typeof KitchenDutyDatastore.definition>


export default KitchenDutyDatastore;
