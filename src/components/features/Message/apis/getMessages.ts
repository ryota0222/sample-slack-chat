import client from '@/lib/axios'
import { IMessage } from '../types'

export const getMessages = (id?: string) => {
    if (!id) return null
    return client.get<IMessage[]>(`/api/users/${id}/messages`)
}