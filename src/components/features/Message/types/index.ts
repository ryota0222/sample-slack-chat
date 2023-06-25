import { IUser } from "../../User/types"

export interface IMessage {
    text: string
    user: IUser
    createdAt: string
    uid: string
    to: string
}

export interface IPostMessageRequest {
    text?: string
    uid?: string
}