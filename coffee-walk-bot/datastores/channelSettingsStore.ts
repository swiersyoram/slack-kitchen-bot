import {DefineDatastore} from "deno-slack-sdk/datastore/mod.ts";
import {Schema} from "deno-slack-sdk/mod.ts";
import {DatastoreItem} from "deno-slack-api/typed-method-types/apps.ts";

const channelSettingsDataStore = DefineDatastore({
    name: "channelSettings",
    primary_key: "channel",
    attributes: {
        channel: {
            type: Schema.slack.types.channel_id,
        },
        triggerId: {
            type: Schema.types.string,
        },
        excluded: {
            type: Schema.types.array,
            items: {
                type: Schema.slack.types.user_id,
            },
        },
        startTime: {
            type: Schema.types.number,
        },
    },
});


export type ChannelSetting = DatastoreItem<typeof channelSettingsDataStore.definition>


export default channelSettingsDataStore;