// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@/lib/firebaseAdmin'
import axios from 'axios';
import qs from "qs";
import { IncomingWebhook } from '@slack/webhook';

const SLACK_API_URL = 'https://slack.com/api';

const TARGET_USER_ID = 'sample'

const PATTERN = 'open-modal-button_'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token, trigger_id, user, actions, type, container, view, message } = JSON.parse(req.body.payload)
    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL as string);
    if (req.method === 'POST') {
        if (actions &&
            actions[0].action_id.indexOf(PATTERN) === 0) {
                await webhook.send({
                    text: `
                    ${JSON.stringify(JSON.parse(req.body.payload))}
                    `
                })
            const uid = actions[0].action_id.slice(PATTERN.length)
            await webhook.send({
                text: `
+++++++++++++++++++++++++++++++
    uid: ${uid}
+++++++++++++++++++++++++++++++
                `
            })
            const args = {
                token: process.env.SLACK_BOT_TOKEN,
                trigger_id: trigger_id,
                view: getModalTemplate(JSON.stringify({uid}))
            };
            await axios.post(`${SLACK_API_URL}/views.open`, qs.stringify(args));
        } else if (type === 'view_submission') {
            // NOTE: pass!
            const {uid} = JSON.parse(view.private_metadata)
            const db = firebaseAdmin.firestore()
            const docRef = db.collection('messages').doc();
            const fromUserDocRef = db.collection('users').doc(TARGET_USER_ID)
            const toUserDocRef = db.collection('users').doc(uid)
            const text = view.state.values['replay-message']['plain_text_input-action'].value !== undefined ? view.state.values['replay-message']['plain_text_input-action'].value : ""
            void docRef.set({
                text,
                createdAt: new Date(),
                uid: TARGET_USER_ID,
                to: toUserDocRef,
                from: fromUserDocRef
            });
            await webhook.send({
                text: `以下のメッセージを送信しました！
メッセージ：
${text}
`
            })
            return res.status(200).json({
                "response_action": "clear"
            })
        }
        res.status(200)
    } else {
        res.status(404)
    }
}

const getModalTemplate = (metadata: string) => {
    return JSON.stringify({
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "Reply",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "private_metadata": metadata,
        "blocks": [
            {
                "type": "input",
                "block_id": "replay-message",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "plain_text_input-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "返信を入力してください",
                    "emoji": true
                }
            }
        ]
    })
}