import {DefineFunction} from "deno-slack-sdk/functions/definitions/slack-function.ts";
import {Schema, SlackFunction} from "deno-slack-sdk/mod.ts";
import channelSettingsDataStore from "../datastores/channelSettingsStore.ts";
import {DatastoreItem} from "deno-slack-api/typed-method-types/apps.ts";
import {ScheduledTrigger} from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import {eventWorkflow} from "../workflows/eventWorkflow.ts";
import {dateFromTimeInSec} from "../util/time.util.ts";

export const saveMenuSettingsFunction = DefineFunction({
        callback_id: "save-menu-settings-function",
        title: "Save menu function",
        source_file: "functions/saveMenuSettingsFunction.ts",
        input_parameters: {
            properties: {
                channel: {type: Schema.slack.types.channel_id},
                excludedUsers: {type: Schema.types.array, items: {type:Schema.slack.types.user_id} },
                startTime: {type: Schema.types.number},
            },
            required: [ "channel", "excludedUsers", "startTime" ],
        },
        output_parameters: {
            properties: {
            },
            required: []
        },
    }
);

export default SlackFunction(
    saveMenuSettingsFunction,
    async ({inputs, client}) => {

        const channelSettings = await client.apps.datastore.get<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            id: inputs.channel,
        })

        const time: string = dateFromTimeInSec(inputs.startTime).toISOString();
        const newScheduledTrigger: ScheduledTrigger<typeof eventWorkflow.definition> = {
            type: "scheduled",
            name: "Scheduled trigger for the rotation workflow",
            description: "A scheduled trigger for the event workflow",
            workflow: `#/workflows/${eventWorkflow.definition.callback_id}`,
            inputs: {
                channel: {
                    value: inputs.channel,
                },
            },

            schedule: {
                start_time: time,
                frequency: {
                    type: "monthly",
                    repeats_every: 1,
                },
            },
        };

        const triggerRes = await client.workflows.triggers.create<
            typeof eventWorkflow.definition
        >(
            newScheduledTrigger,
        );


        const newChannelSettings: DatastoreItem<typeof channelSettingsDataStore.definition> = {
            channel: inputs.channel,
            excluded: inputs.excludedUsers,
            startTime: inputs.startTime,
            triggerId: triggerRes.trigger?.id
        };

        await client.apps.datastore.put<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            item: newChannelSettings,
        });


        if (Object.keys(channelSettings.item).length > 0) {
            const deleteTriggerResp = await client.workflows.triggers.delete({
                trigger_id: channelSettings.item.triggerId,
            });

            if (!deleteTriggerResp.ok) {
                return {
                    error: deleteTriggerResp.error ??
                        "Failed to delete past scheduled trigger",
                };
            }
        }

        return {outputs: {}};
    }
);
