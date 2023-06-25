export interface IUser {
    webhook: string,
    botToken: string,
    name: string,
    avatar: string
}

export interface IPutWebhookRequest {
    uid?: string,
    webhook?: string
}

export interface IPutBotTokenRequest {
    uid?: string,
    token?: string
}