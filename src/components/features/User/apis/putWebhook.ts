import client from '@/lib/axios'
import { IPutWebhookRequest, IUser } from '../types'

export const putWebhook = async (req: IPutWebhookRequest) => {
if (!req.uid) return null
if (!req.webhook) return null
    return await client.put<IUser>(`/api/webhook`, {
        id: req.uid,
        webhookUrl: req.webhook
    })
}