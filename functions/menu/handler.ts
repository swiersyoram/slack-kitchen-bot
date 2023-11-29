import {SlackFunction} from "deno-slack-sdk/mod.ts";
import {getMessage} from "../send_message/util.ts";


import {menuFunctionDefinition} from "./definition.ts";
import {buildMenuForm} from "./blocks.ts";
import kitchDutyStore from "../../datastores/kitch-duty-store.ts";

export default SlackFunction(
    menuFunctionDefinition,
    async ({inputs, client}) => {
        const rotation = await client.apps.datastore.get<
            typeof kitchDutyStore.definition
        >({
            datastore: kitchDutyStore.name,
            id: inputs.channel,
        });

        const response = await client.views.open({
            interactivity_pointer: inputs.interactivity.interactivity_pointer,
            view: buildMenuForm(Object.keys(rotation.item).length ? rotation.item : undefined)
        });
        if (response.error) {
            const error =
                `Failed to open a modal in the demo workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
            return {error};
        }
        return {
            completed: false,
        };
    },
).addBlockActionsHandler(["send_reminder"], async ({inputs, client}) => {

    await client.chat.postMessage({
        channel: inputs.channel,
        blocks: await getMessage(client, inputs.channel),
        attachments: []
    })
    return {
        completed: false,
    }
}).addBlockActionsHandler(["delete_rotation"], async ({inputs, client, body}) => {

    const { channel,  interactivity } = inputs;

    const rotation = await client.apps.datastore.get<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        id: inputs.channel,
    });

    await client.workflows.triggers.delete({
        trigger_id: rotation.rotation_trigger_id,
    });

     await client.apps.datastore.delete<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        id: channel,
    });

    const viewUpdateRes = await client.views.update({
        view_id: body.view.id,
        view: buildMenuForm(undefined),
    });

    if (!viewUpdateRes.ok) {
        console.log(
            `View failed to update. Pointer: ${interactivity.interactivity_pointer}`,
        );
    }

    return {
        completed: false,
    }
})
    .addViewSubmissionHandler(["menu"], async ({view, client, body, inputs}) => {
        const excludedUsers = view.state.values.multi_users_select_block.user_select.selected_users
        const startTime = view.state.values.start_datepicker_input.start_datepicker_datepicker.selected_date_time
        const formValues = {
            excludedUsers,
            channel: inputs.channel,
            startTime
        }

        await client.functions.completeSuccess({
            function_execution_id: body.function_data.execution_id,
            outputs: {
                ...formValues
            },
        });

    }).addViewClosedHandler(
        ['menu'],
        () => {
            return {completed: true}
        },
    );