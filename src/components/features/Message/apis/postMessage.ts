import client from '@/lib/axios'
import { IPostMessageRequest, IMessage } from '../types'

export const postMessage = async (req: IPostMessageRequest) => {
if (!req.uid) return null
if (!req.text) return null
    return await client.post<IMessage>(`/api/users/${req.uid}/messages`, {
        id: req.uid,
        text: req.text
    })
}