import {SlackFunction} from "deno-slack-sdk/mod.ts";
import {createRotationDefinition} from "./definition.ts";
import {ScheduledTrigger} from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import messageWorkFlow from "../../workflows/message_workflow.ts";
import {DatastoreItem} from "deno-slack-api/typed-method-types/apps.ts";
import kitchDutyStore from "../../datastores/kitch-duty-store.ts";

export  default SlackFunction(createRotationDefinition,async ({inputs, client})=>{
    const channelGetResp = await client.apps.datastore.get<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        id: inputs.channel,
    });

    const newScheduledTrigger: ScheduledTrigger<typeof messageWorkFlow.definition> = {
        type: "scheduled",
        name: "Scheduled trigger for the rotation workflow",
        description: "A scheduled trigger for the rotation workflow",
        workflow: "#/workflows/message_workflow",
        inputs: {
            channel: {
                value: inputs.channel,
            },
        },
        // @ts-expect-error type error due to frequency type of "once" not being compatible with other
        schedule: getTriggerSchedule(false, inputs),
    };

    const newScheduledTriggerResp = await client.workflows.triggers.create<
        typeof messageWorkFlow.definition
    >(
        newScheduledTrigger,
    );

    if (!newScheduledTriggerResp.ok) {
        console.log(
            "There was an error scheduling the trigger",
            newScheduledTriggerResp.error,
            newScheduledTriggerResp.response_metadata,
        );
        return {
            error: newScheduledTriggerResp.error ??
                "Failed to create scheduled trigger",
        };
    }

    const newRotation: DatastoreItem<typeof kitchDutyStore.definition> = {
        rotation_trigger_id: newScheduledTriggerResp.trigger.id,
        channel: inputs.channel,
        start_time: inputs.startTime,
        excluded: inputs.excludedUsers
    };

    await client.apps.datastore.put<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        item: newRotation,
    });

    if (Object.keys(channelGetResp.item).length > 0) {
        const deleteTriggerResp = await client.workflows.triggers.delete({
            trigger_id: channelGetResp.item.rotation_trigger_id,
        });

        if (!deleteTriggerResp.ok) {
            return {
                error: deleteTriggerResp.error ??
                    "Failed to delete past scheduled trigger",
            };
        }
    }


    return { outputs: {} };
})

export function getTriggerSchedule(debugMode: boolean, inputs: any) {
    const DELAY_SEC = 10;
    const { startTime } = inputs;

    if (debugMode) {
        console.log("DEBUG MODE IS ON");
        const now = new Date();
        const delayInSeconds = now.getSeconds() + DELAY_SEC;
        const startTime = new Date(now.setSeconds(delayInSeconds));

        return {
            start_time: startTime.toISOString(),
        };
    } else {
        const time: Date = dateFromTimeInSec(startTime);
        return {
            start_time: time.toISOString(),
            frequency: {
                type: "daily",
                repeats_every: 1,
            },
        };
    }
}

export function dateFromTimeInSec(timeInSec: number): Date {
    return new Date(timeInSec * 1000);
}