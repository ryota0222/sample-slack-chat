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
            const userDoc = await (message.user as any).get()
            let user = null
            if (userDoc.exists) user = userDoc.data() as IUser
            return {
                ...message,
                createdAt: (message.createdAt as any).toDate(),
                user
            }
        }));
        res.status(200).json(data)
    } else if (req.method === 'POST') {
        if (typeof text !== 'string') {
            return res.status(400).send('メッセージ内容の取得に失敗しました')
        }
        const docRef = db.collection('messages').doc();
        const userDocRef = db.collection('users').doc(userId);
        const result = await docRef.set({
            text,
            createdAt: new Date(),
            user: userDocRef,
            uid: userId,
            to: 'sample'
        });
        // slackに通知
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            const user = userDoc.data() as IUser
            if (user.webhook?.length) {
                const webhook = new IncomingWebhook(user.webhook);
                await webhook.send({
                    username: user.name,
                    icon_url: user.avatar,
                    blocks: [
                        {
                            type: "section",
                            block_id: "button-block",
                            text: {
                                type: "mrkdwn",
                                "text": `${user.name}さんからメッセージが届きました。
メッセージ：
${text}`,
                            },
                            accessory: {
                                type: "button",
                                text: { type: "plain_text", "text": "モーダルを開いて返信" },
                                action_id: "open-modal-button",
                                style: 'primary',
                                value: userId
                            },
                        }
                    ],
                    text: `*${user.name}さんからメッセージが届きました。*
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
