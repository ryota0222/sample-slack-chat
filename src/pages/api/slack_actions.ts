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
    const { token, trigger_id, user, actions, type, container, view } = req.body.payload
    if (req.method === 'POST') {
        const webhook = new IncomingWebhook('https://hooks.slack.com/services/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');
        await webhook.send({
            text: `
actions: ${JSON.stringify(actions)}
args: ${JSON.stringify({
    token: process.env.SLACK_BOT_TOKEN,
    trigger_id: trigger_id,
})}
`
        })
        if (actions && actions[0].action_id.match(/open-modal-button/)) {
            const args = {
                token: process.env.SLACK_BOT_TOKEN,
                trigger_id: trigger_id,
                view: JSON.stringify(MODAL_TEMPLATE)
            };
            await axios.post(`${SLACK_API_URL}/views.open`, qs.stringify(args));
        } else if (type === 'view_submission') {
            const db = firebaseAdmin.firestore()
            const docRef = db.collection('messages').doc();
            await docRef.set({
                text: view.state.values['replay-message'].content.value!== undefined ? view.state.values['replay-message'].content.value :"",
                createdAt: new Date(),
                uid: JSON.stringify(view)
            });
            const args = {
                token: process.env.SLACK_BOT_TOKEN,
                user_id: user.id,
                view: MODAL_COMPLETE_TEMPLATE
              };
            
            await axios.post(
                `${SLACK_API_URL}/views.publish`,
                qs.stringify(args)
            );
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
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Complete!",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
}
