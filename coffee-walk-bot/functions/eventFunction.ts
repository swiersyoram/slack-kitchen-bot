
import { DefineFunction, SlackFunction, Schema } from "deno-slack-sdk/mod.ts";
import {shuffle} from "../util/array.util.ts";
import channelSettingsDataStore from "../datastores/channelSettingsStore.ts";

export const eventFunctionDefinition = DefineFunction({
    callback_id: "event-function",
    title: "Event function",
    source_file: "functions/eventFunction.ts",
    input_parameters: {
        properties: {
            channel: { type: Schema.slack.types.channel_id  }
        },
        required: [],
    },
    output_parameters: {
        properties: {},
        required: [],
    },
});

export default SlackFunction(
    eventFunctionDefinition,
    async ({ inputs, client }) => {
        const channelSettings = await client.apps.datastore.get<
            typeof channelSettingsDataStore.definition
        >({
            datastore: channelSettingsDataStore.name,
            id: inputs.channel,
        }).then(res=>res?.item)


        const users = await client.conversations.members({  channel: inputs.channel }).then(res => res.members)

        const groups = getEventGroups(users.filter((user:string) => !channelSettings?.excluded.includes(user)))

        for (const group of groups) {
            const channel = await client.conversations.open({
                users: group.join(','),
            }).then(res => res?.channel?.id)
            console.log(channel)
            await client.chat.postMessage({
                channel,
                blocks:[

                            {
                                "type": "rich_text",
                                "elements": [
                                    {
                                        "type": "rich_text_section",
                                        "elements": [
                                            {
                                                "type": "text",
                                                "text": "Hi team, this is your monthly Coffee Walk reminder- time to move!\n\n"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "rich_text",
                                "elements": [
                                    {
                                        "type": "rich_text_section",
                                        "elements": [
                                            {
                                                "type": "text",
                                                "text": "Take your coat, have a walk, grab a coffee and walk back with following 3 beloved colleagues:\n\n"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "rich_text_list",
                                        "style": "bullet",
                                        "elements": group.map((user:string) => ({
                                            "type": "rich_text_section",
                                            "elements": [
                                                {
                                                    "type": "user",
                                                    "user_id": user
                                                },
                                            ]
                                        }))
                                    }
                                ]
                            },
                            {
                                "type": "rich_text",
                                "elements": [
                                    {
                                        "type": "rich_text_section",
                                        "elements": [
                                            {
                                                "type": "text",
                                                "text": "\n\nHave a good laugh, a nice chat and get to know each other! Cheers! "
                                            },
                                            {
                                                "type": "emoji",
                                                "name": "coffee",
                                                "unicode": "2615"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
            })
        }

        return { outputs: {} };
    }
)


export const getEventGroups = (members: string[]) => {
    const groups = [];
    const groupSize = 3
    const shuffledMembers = shuffle(members);

    for (let i = 0; i < shuffledMembers.length; i = i + groupSize) {
        groups.push(shuffledMembers.slice(i, i + groupSize));
    }

    return groups;
}
