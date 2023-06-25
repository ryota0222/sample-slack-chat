import client from '@/lib/axios'
import { IUser } from '../types'

export const getProfile = async (id?: string) => {
    if (!id) return null
    return await client.get<IUser>(`/api/users/${id}`)
}