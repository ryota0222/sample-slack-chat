import client from '@/lib/axios'
import { IPutBotTokenRequest, IUser } from '../types'

export const putBotToken = async (req: IPutBotTokenRequest) => {
if (!req.uid) return null
if (!req.token) return null
    return await client.put<IUser>(`/api/bot_token`, {
        id: req.uid,
        token: req.token
    })
}