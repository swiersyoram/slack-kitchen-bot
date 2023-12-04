import moment from "momentjs/mod.ts";
import {SlackAPIClient} from "deno-slack-api/types.ts";
import kitchDutyStore from "../../datastores/kitch-duty-store.ts";



export const getUsers = (usersArray:string[], iteration:number) => {
    const startIndex = (iteration % Math.floor(usersArray.length / 3)) * 3;
    const endIndex = startIndex + 3;
    return usersArray.slice(startIndex, endIndex);
}

export const getMessage = async(client:SlackAPIClient, channel:string, iterate: boolean ) =>{
    const rotation = await client.apps.datastore.get<
        typeof kitchDutyStore.definition
    >({
        datastore: kitchDutyStore.name,
        id: channel,
    });

    let iteration = iterate ? rotation.item.iteration + 1: rotation.item.iteration;


    const excludedUsers = rotation.item.excluded;

    const channelUsers = await client.conversations.members({channel})
    const allowedChannelUsers = channelUsers.members.filter((user:any) => !excludedUsers.includes(user))
    const users = await client.users.list();


    let selectedUserIds:string[] = getUsers(allowedChannelUsers, iteration)
    while(iterate && rotation.item.last_rotation[0] === selectedUserIds[0]){
        ++iteration;
        selectedUserIds = getUsers(allowedChannelUsers, iteration);
    }

    const selectedUsers = users.members.filter((user:any) => selectedUserIds.includes(user.id))

    if(iterate){
        rotation.item.iteration = iteration ;
        rotation.item.last_rotation = selectedUserIds;
        await client.apps.datastore.put<
            typeof kitchDutyStore.definition
        >({
            datastore: kitchDutyStore.name,
            item: rotation.item
        });
    }

    return messageConstructor(selectedUsers)
}


const greetings = [
    "Hey Team Awesome Sauce!",
    "Greetings, Earthlings of the Office Galaxy!",
    "Salutations, Masters of the Cubicle Realm!",
    "Hello, Office Rockstars and Keyboard Ninjas!",
    "Dear Work-From-Homers and Office Olympians,",
    "Hey Squad, Ready to Conquer the Work Jungle?",
    "Greetings, Minions of the Coffee Machine Kingdom!",
    "To the A-team: Assemble for another day of greatness!",
    "Hello Fabulous Colleagues, Wizards of Work Wonders!",
    "Hey Office Geniuses, let's make magic happen today!",
    "Salute, Champions of the Corporate Arena!",
    "Dear Work Pals, Unicorns of the Workplace Rainbow!",
    "Hello Workmates, Guardians of the Office Galaxy!",
    "Hey Dream Team, ready to turn coffee into code?",
    "Greetings, Fellow Pirates of the Cubicle Sea!",
    "Hello Legends, Masters of the Spreadsheet Symphony!",
    "Hey Superstars, Defenders of the Office Fortress!",
    "Dear Office Jedi, May the Productivity Force be with You!",
    "Salutations, Pioneers of the Professional Playground!",
    "Hey Colleagues, Avengers of Administrative Tasks!"
]


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
                "text": `${greetings[Math.floor(Math.random() * greetings.length)]} :dancers:\n It's time to keep our kitchen sparkling clean,\n and it's your turn in the dishwasher duty rotation.`
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


