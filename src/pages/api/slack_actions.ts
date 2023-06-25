// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {firebaseAdmin} from '@/lib/firebaseAdmin'
import axios from 'axios';
import qs from "qs";
import { IncomingWebhook } from '@slack/webhook';

const SLACK_API_URL = 'https://slack.com/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { token, trigger_id, user, actions, type, container, view } = JSON.parse(req.body.payload)
    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL as string);
    
    if (req.method === 'POST') {
        if (actions && actions[0].action_id === 'open-modal-button') {
            const args = {
                token: process.env.SLACK_BOT_TOKEN,
                trigger_id: trigger_id,
                view: JSON.stringify(MODAL_TEMPLATE)
            };
            await axios.post(`${SLACK_API_URL}/views.open`, qs.stringify(args));
        } else if (type === 'view_submission') {
            // NOTE: pass!
            const db = firebaseAdmin.firestore()
            const docRef = db.collection('messages').doc();
            const userDocRef = db.collection('users').doc('sample')
            void docRef.set({
                text: view.state.values['replay-message']['plain_text_input-action'].value !== undefined ? view.state.values['replay-message']['plain_text_input-action'].value : "",
                createdAt: new Date(),
                uid: 'sample',
                to: '',
                user: userDocRef
            });
            // NOTE: pass!
            const args = {
                token: process.env.SLACK_BOT_TOKEN,
                view_id: view.id,
                view: JSON.stringify(MODAL_COMPLETE_TEMPLATE)
            };
            await webhook.send({
                text: JSON.stringify(args)
            })
            // try {
            //     await axios.post(`${SLACK_API_URL}/views.update`, qs.stringify(args));
            // }catch (err) {
            //     if (err instanceof Error) {
            //         await webhook.send({
            //             text: JSON.stringify(err.message)
            //         })
            //     }
            // }
            return res.status(200).json({
                "response_action": "clear"
            })
        }
        res.status(200)
    } else {
        res.status(404)
    }
}

const MODAL_TEMPLATE = {
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
}

const MODAL_COMPLETE_TEMPLATE = {
    "title": {
        "type": "plain_text",
        "text": "Complete!",
        "emoji": true
    },
    "type": "modal",
    "blocks": [
        {
            "type": "context",
            "elements": [
                {
                    "type": "plain_text",
                    "text": "メッセージを送信しました",
                    "emoji": true
                }
            ]
        }
    ],
    "submit": null,
    "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
    }
}