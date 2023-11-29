import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts';
import moment from "momentjs/mod.ts";
import {SlackAPIClient} from "deno-slack-api/types.ts";
import kitchDutyStore from "../../datastores/kitch-duty-store.ts";



export const getUsers = (usersArray:any, currentWeek:number) => {
  const usersPerWeek = 3;
  const startIndex = (currentWeek - 1) * usersPerWeek;
  const endIndex = startIndex + usersPerWeek;
  const rotatedUsers = usersArray.slice(startIndex, endIndex).concat(usersArray.slice(0, startIndex));

  return rotatedUsers.slice(0, usersPerWeek);
}

export const getMessage = async(client:SlackAPIClient, channel:string ) =>{
    const rotation = await client.apps.datastore.get<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        id: channel,
    });

    const excludedUsers = rotation.item.excluded;
    const currentWeek = moment().week();

    const channelUsers = await client.conversations.members({channel})
    const allowedChannelUsers = channelUsers.members.filter((user:any) => !excludedUsers.includes(user))
    const users = await client.users.list();

    const selectedUserIds = getUsers(allowedChannelUsers, currentWeek);
    const selectedUsers = users.members.filter((user:any) => selectedUserIds.includes(user.id))


    // console.log(selectedUsers[0])

    return messageConstructor(selectedUsers)
}


export const messageConstructor = (users:any)=>[
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": ":knife_fork_plate: Dishwasher Duty Alert! :knife_fork_plate:"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Hey besties! :dancers:\n It's time to keep our kitchen sparkling clean,\n and it's your turn in the dishwasher duty rotation."
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `:date:\t*${moment().startOf('isoWeek').format("ddd D MMMM")} -  ${moment().endOf('isoWeek').format("ddd D MMMM")}*\t:date:`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":busts_in_silhouette:\t*Team on duty*\t:busts_in_silhouette:"
            }
        },
        {
            "type": "rich_text",
            "elements": [
                {
                    "type": "rich_text_list",
                    "style": "bullet",
                    "indent": 0,
                    "border": 0,
                    "elements": users.map((user:any) => {
                            return {
                                "type": "rich_text_section",
                                "elements": [
                                    {
                                        "type": "user",
                                        "user_id": user.id,
                                    },
                                ]
                            }
                        }
                    )
                },
                {
                    "type": "rich_text_section",
                    "elements": []
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":soap:\t*Dish duty checklist*\t:soap:"
            }
        },
        {
            "type": "rich_text",
            "elements": [
                {
                    "type": "rich_text_list",
                    "style": "ordered",
                    "indent": 0,
                    "border": 0,
                    "elements": [
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Load dirty dishes into the dishwasher."
                                }
                            ]
                        },
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Add detergent."
                                }
                            ]
                        },
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Start the dishwasher."
                                }
                            ]
                        },
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Unload clean dishes and put them away."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "type": "rich_text",
            "elements": [
                {
                    "type": "rich_text_section",
                    "elements": [
                        {
                            "type": "emoji",
                            "name": "raised_hands",
                            "unicode": "1f64c"
                        },
                        {
                            "type": "text",
                            "text": "\tYour combined efforts ensure a happy and tidy kitchen for everyone.\n Work together, and if you have any questions or need assistance, feel free to ask.\n\n\nThanks for keeping things clean and running smoothly! "
                        },
                        {
                            "type": "emoji",
                            "name": "heart",
                            "unicode": "2764-fe0f"
                        }
                    ]
                }
            ]
        }
    ]


