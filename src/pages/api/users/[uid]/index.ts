// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@/lib/firebaseAdmin'
import { IUser } from '@/components/features/User/types';

const COLLECTION_NAME = 'users';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IUser | string>
) {
    const userId = req.query.uid
    if (typeof userId !== 'string') {
        return res.status(400).send('ユーザー情報の取得に失敗しました')
    }
    if (req.method === 'GET') {
    const db = firebaseAdmin.firestore()
        const docRef = db.collection(COLLECTION_NAME).doc(userId);
        const result = await docRef.get();
        console.log('result======================')
        console.log(result.data())
        if (result.exists) {
            res.status(200).json(result.data() as IUser)
        } else {
            res.status(400).json('ユーザー情報の取得に失敗しました')
        }
    } else {
        res.status(404)
    }
}
