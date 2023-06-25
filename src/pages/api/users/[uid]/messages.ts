// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@/lib/firebaseAdmin'
import { IUser } from '@/components/features/User/types'
import { IncomingWebhook } from "@slack/webhook"
import { IMessage } from '@/components/features/Message/types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userId = req.query.uid
    const text = req.body.text
    const db = firebaseAdmin.firestore()
    if (typeof userId !== 'string') {
        return res.status(400).send('ユーザー情報の取得に失敗しました')
    }
    if (req.method === 'GET') {
        const querySnapshot = await db.collection('messages').orderBy('createdAt', 'desc').where('uid', '==', userId).get();
        const data = await Promise.all(querySnapshot.docs.map(async doc => {
            const message = doc.data() as IMessage
            const fromUserDoc = await (message.from as any).get()
            const toUserDoc = await (message.to as any).get()
            let from = null
            let to = null
            if (fromUserDoc.exists) from = fromUserDoc.data() as IUser
            if (toUserDoc.exists) to = toUserDoc.data() as IUser
            return {
                ...message,
                createdAt: (message.createdAt as any).toDate(),
                from,
                to
            }
        }));
        res.status(200).json(data)
    } else if (req.method === 'POST') {
        if (typeof text !== 'string') {
            return res.status(400).send('メッセージ内容の取得に失敗しました')
        }
        const docRef = db.collection('messages').doc();
        const fromUserDocRef = db.collection('users').doc(userId);
        const toUserDocRef = db.collection('users').doc('sample');
        await docRef.set({
            text,
            createdAt: new Date(),
            from: fromUserDocRef,
            uid: userId,
            to: toUserDocRef
        });
        // slackに通知
        const fromUserDoc = await fromUserDocRef.get();
        if (fromUserDoc.exists) {
            const from = fromUserDoc.data() as IUser
            if (from.webhook?.length) {
                const webhook = new IncomingWebhook(from.webhook);
                await webhook.send({
                    username: from.name,
                    icon_url: from.avatar,
                    blocks: [
                        {
                            type: "section",
                            block_id: "button-block",
                            text: {
                                type: "mrkdwn",
                                "text": `*${from.name}さんからメッセージが届きました。*
メッセージ：
${text}`,
                            },
                            accessory: {
                                type: "button",
                                text: { type: "plain_text", "text": "モーダルを開いて返信" },
                                action_id: `open-modal-button_${userId}`,
                                style: 'primary',
                            },
                        }
                    ],
                    text: `*${from.name}さんからメッセージが届きました。*
メッセージ：
${text}`,
                });
            }
        }
        res.status(201).json({ success: true })
    } else {
        res.status(404)
    }
}
