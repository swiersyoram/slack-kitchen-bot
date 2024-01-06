
import {dateFromTimeInSec} from "../util/time.util.ts";
import moment from 'momentjs/mod.ts'
import  {ChannelSetting} from "../datastores/channelSettingsStore.ts";

export const menuView = (settings?: ChannelSetting) => {
    return ({
        "type": "modal",
        "callback_id": "menu",
        "title": {"type": "plain_text", "text": "Coffee walk bot menu"},
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "blocks": [
            {
                "type": "divider"
            },
            ...settings?.triggerId ?
                [
                    {
                        "type": "rich_text",
                        "elements": [
                            {
                                "type": "rich_text_section",
                                "elements": [
                                    {
                                        "type": "text",
                                        "text": "☕️\tActive coffee walk event in channel "
                                    },
                                    {
                                        "type": "channel",
                                        "channel_id": settings?.channel
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
                                        "text": moment(dateFromTimeInSec(settings?.startTime)).format("dddd, MMMM Do YYYY [at] h:mm:ss"),
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
                                "text": "Delete event schedule",
                                "emoji": true
                            },
                            "value": "delete_event",
                            "action_id": "delete_event",
                        }
                    ]
                }] : [{
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "\nYou don't have an active coffee walk events in this channel! 🤷‍\n\n"
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
                    "text": "🚫  *Exclude users coffee walk events*",
                },
                "accessory": {
                    "action_id": "user_select",
                    "initial_users": settings?.excluded,
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
                    initial_date_time: settings?.startTime,
                    action_id: "start_datepicker_datepicker",
                },
                label: {
                    type: "plain_text",
                    text: "📆  Starting coffee walk event date",
                    emoji: true,
                },
            }
        ],

    })
}