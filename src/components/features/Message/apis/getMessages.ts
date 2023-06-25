import client from '@/lib/axios'
import { IMessage } from '../types'

export const getMessages = async (id?: string) => {
    if (!id) return null
    return await client.get<IMessage[]>(`/api/users/${id}/messages`)
}