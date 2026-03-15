import env from "#start/env";
import { GatewayInterface, ChargeData, ChargeResponse } from "./interface.ts";

let cachedToken: string | null = null
let tokenExpiresAt: number | null = null
let expireTime: number = (50*60*1000)

export default class Gateway1Service implements GatewayInterface {
    
    //private token: string | null = null

    private async authenticate(): Promise<void> {
        const response = await fetch(env.get('GATEWAY1_URL') + '/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: env.get('GATEWAY1_EMAIL'),
            token: env.get('GATEWAY1_TOKEN')}) 
    })
        if (!response.ok) throw new Error(`Falha na autenticação do Gateway 1: ${response.status}`)

        const data = await response.json() as {token: string}
        cachedToken = data.token
        tokenExpiresAt = Date.now() + (expireTime)
        
    }
  
    private async getToken(): Promise<string> {
        const now = Date.now()
        if(!cachedToken || !tokenExpiresAt || now > tokenExpiresAt){
            await this.authenticate()
        }
            return cachedToken!
      

    }
  
    async charge(data: ChargeData): Promise<ChargeResponse> {
        const token_auth = await this.getToken()
        const response = await fetch (env.get('GATEWAY1_URL') + '/transactions', {method: "POST", 
        headers:{"Content-Type": "application/json", Authorization: `Bearer ${token_auth}`},
        body: JSON.stringify({"amount": data.amount, "name": data.name,
        "email": data.email,
        "cardNumber": data.cardNumber,
        "cvv": data.cvv})})
        if(!response.ok) {
            throw new Error (`Algo deu errado: ${response.status}`)
        }
        return await response.json() as ChargeResponse
        
    }
  
    async refund(externalId: string): Promise<void> {
        const token_auth = await this.getToken()
        const response = await fetch(env.get('GATEWAY1_URL') + `/transactions/${externalId}/charge_back`, {method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${token_auth}`}})
        if(!response.ok) {
            throw new Error (`Algo deu errado: ${response.status}`)
        }
    }
} 