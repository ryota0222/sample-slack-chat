export interface IUser {
    webhook: string,
    name: string,
    avatar: string
}

export interface IPutWebhookRequest {
    uid?: string,
    webhook?: string
}