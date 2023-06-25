import { IUser } from "../../User/types"

export interface IMessage {
    text: string
    from: IUser
    to: IUser
    createdAt: string
    uid: string
}

export interface IPostMessageRequest {
    text?: string
    uid?: string
}