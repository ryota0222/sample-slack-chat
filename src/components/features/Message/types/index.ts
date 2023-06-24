import { IUser } from "../../User/types"

export interface IMessage {
    text: string
    user: IUser
    createdAt: string
}

export interface IPostMessageRequest {
    text?: string
    uid?: string
}