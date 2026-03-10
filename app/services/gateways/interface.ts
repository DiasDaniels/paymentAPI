export type ChargeData = {
    amount: number
    name:string
    email:string
    cardNumber:string
    cvv:string
}

export type ChargeResponse = {
    id: string
    status: string
}

export interface GatewayInterface {
    charge (data:ChargeData): Promise<ChargeResponse>
    refund (externalId: string): Promise<void>
}