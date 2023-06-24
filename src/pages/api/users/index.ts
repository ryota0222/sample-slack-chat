// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@/lib/firebaseAdmin'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userId = req.body.id
    const webhookUrl = req.body.webhookUrl
    const name = req.body.name
    const avatar = req.body.avatar
    const db = firebaseAdmin.firestore()
    if (typeof name !== 'string') {
        return res.status(400).send('ユーザー名の取得に失敗しました')
    }
    if (typeof avatar !== 'string') {
        return res.status(400).send('プロフィール画像の取得に失敗しました')
    }
    if (typeof userId !== 'string') {
        return res.status(400).send('ユーザー情報の取得に失敗しました')
    }
    if (req.method === 'PUT') {
        /**
         * 更新時
         */
        const docRef = db.collection('users').doc(userId);
        const result = await docRef.update({
            avatar,
            name,
            webhook: typeof webhookUrl === 'string' ? webhookUrl : ''
        });
        console.log(result)
        res.status(200).json({ success: true })
    } else if (req.method === 'POST') {
        /**
         * 登録時
         */
        const docRef = db.collection('users').doc(userId);
        const result = await docRef.set({
            avatar,
            name,
            webhook: typeof webhookUrl === 'string' ? webhookUrl : ''
        });
        console.log(result)
        res.status(201).json({ success: true })
    } else {
        res.status(404)
    }
}
