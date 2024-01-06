
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {menuView} from "../Views/menuView.ts";
import channelSettingsDataStore from "../datastores/channelSettingsStore.ts";

export const menuFunctionDefinition = DefineFunction({
    callback_id: "menu-function",
    title: "Menu function",
    source_file: "functions/menuFunction.ts",
    input_parameters: {
        properties: { interactivity: { type: Schema.slack.types.interactivity }, channel: { type: Schema.slack.types.channel_id }},
        required: ["interactivity", "channel"],
    },
    output_parameters: {
        properties: {excludedUsers: {type: Schema.types.array, items:{type:Schema.slack.types.user_id}}, startTime: {type: Schema.types.number}, channel: {type: Schema.slack.types.channel_id}},
        required: ["excludedUsers", "channel"]},
    }
);

export default SlackFunction(
    menuFunctionDefinition,
    async ({ inputs, client }) => {
        const channelSettings = await client.apps.datastore.get<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            id: inputs.channel,
        }).then(res=>res?.item)

        await client.views.open({
            interactivity_pointer: inputs.interactivity.interactivity_pointer,
            view: menuView(channelSettings),
        });
        return {
            completed: false,
        };
    },
)
    .addBlockActionsHandler(["delete_event"], async ({inputs, client, body }) => {

        const settings = await client.apps.datastore.get<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            id: inputs.channel,
        });

        await client.workflows.triggers.delete({
            "trigger_id": settings.item.triggerId,
        });

        await client.apps.datastore.delete<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            id: inputs.channel,
        });

        await client.views.update({
            view_id: body.view.id,
            view: menuView(),
        });


        return {
            completed: false,
        }
    })
    .addViewSubmissionHandler(['menu'], async ({view, client, body, inputs}) => {
    const excludedUsers = view.state.values.multi_users_select_block.user_select.selected_users
    const startTime = view.state.values.start_datepicker_input.start_datepicker_datepicker.selected_date_time
    const channel = inputs.channel

    await client.functions.completeSuccess({
        function_execution_id: body.function_data.execution_id,
        outputs: {
            excludedUsers,
            channel,
            startTime
        },
    });

}).addViewClosedHandler(
    ['menu'],
    () => {
        return {completed: true}
    },
);