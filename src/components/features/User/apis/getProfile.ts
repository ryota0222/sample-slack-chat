import client from '@/lib/axios'
import { IUser } from '../types'

export const getProfile = (id?: string) => {
    if (!id) return null
    return client.get<IUser>(`/api/users/${id}`)
}