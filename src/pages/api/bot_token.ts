// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {firebaseAdmin} from '@/lib/firebaseAdmin'

const COLLECTION_NAME = 'users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const userId = req.body.id
    const token = req.body.token
    if (typeof userId !== 'string') {
        return res.status(400).send('ユーザー情報の取得に失敗しました')
    }
    if (typeof token !== 'string') {
        return res.status(400).send('トークン情報の取得に失敗しました')
    }
    const db = firebaseAdmin.firestore()
    if (req.method === 'PUT') {
        const docRef = db.collection(COLLECTION_NAME).doc(userId);
    await docRef.update({
        botToken: token
    });
    res.status(200).json({ success: true })
    } else {
        res.status(404)
    }
}
