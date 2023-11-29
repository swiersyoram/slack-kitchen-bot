import kitchDutyStore, {KitchenDutyRotation} from "../../datastores/kitch-duty-store.ts";
import moment from "momentjs/mod.ts";
import {dateFromTimeInSec} from "../create_rotation/handler.ts";


export const buildMenuForm = (rotation?: KitchenDutyRotation) => {
    console.log('rotation', rotation)
    return ({
        "type": "modal",
        // Note that this ID can be used for dispatching view submissions and view closed events.
        "callback_id": "menu",
        "title": {"type": "plain_text", "text": "Kitchen duty bot menu"},
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "blocks": [
            {
                "type": "divider"
            },
            ...rotation ?
                [

                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Send a reminder*\n A message will be posted in the channel reminding people of who is on dishwasher duty this week"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Send reminder",
                                "emoji": true
                            },
                            "style": "primary",
                            "action_id": "send_reminder"
                        }
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
                                    "type": "text",
                                    "text": "🧽\tActive kitchen duty rotation in channel "
                                },
                                {
                                    "type": "channel",
                                    "channel_id": rotation.channel
                                }
                            ]
                        },

                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": `📆\tWas started on `
                                },
                                {
                                    "type": "text",
                                    "text": moment(dateFromTimeInSec(rotation?.start_time)).format("dddd, MMMM Do YYYY [at] h:mm:ss"),
                                    "style": {
                                        "bold": true
                                    }
                                }
                            ]
                        },
                    ]
                },{
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "style": "danger",
                            "text": {
                                "type": "plain_text",
                                "text": "Delete rotation",
                                "emoji": true
                            },
                            "value": "delete_rotation",
                            "action_id": "delete_rotation",
                        }
                    ]
                }] : [{
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "\nYou don't have an active rotation! 🤷‍\n\n"
                    }
                }],

            {
                "type": "divider"
            },
            {
                "type": "section",
                "block_id": "multi_users_select_block",
                "text": {
                    "type": "mrkdwn",
                    "text": "🚫  *Exclude users from the kitchen duty*",
                },
                "accessory": {
                    "action_id": "user_select",
                    "initial_users": rotation ? rotation.excluded: undefined,
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users you want to exclude",
                    }
                }
            },

            {
                type: "input",
                block_id: "start_datepicker_input",
                element: {
                    type: "datetimepicker",
                    initial_date_time: rotation ? rotation.start_time : undefined,
                    action_id: "start_datepicker_datepicker",
                },
                hint: {
                    type: "plain_text",
                    text:
                        "Please select a starting date in the future.",
                },
                label: {
                    type: "plain_text",
                    text: "📆  Starting rotation",
                    emoji: true,
                },
            }
        ],

    })
}