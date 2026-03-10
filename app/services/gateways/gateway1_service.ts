import env from "#start/env";
import { GatewayInterface, ChargeData, ChargeResponse } from "./interface.ts";



export default class Gateway1Service implements GatewayInterface {
    
    private token: string | null = null

    private async authenticate(): Promise<void> {
        const response = await fetch(env.get('GATEWAY1_URL') + '/login', {method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: env.get('GATEWAY1_EMAIL'), token: env.get('GATEWAY1_TOKEN')}) 
    })
        const data = await response.json() as {token: string}
        this.token = data.token
    }
  
    private async getToken(): Promise<string> {
      if(this.token == null){
        await this.authenticate()
        return this.token!
      } return this.token

    }
  
    async charge(data: ChargeData): Promise<ChargeResponse> {
        const token_auth = await this.getToken()
        const response = await fetch (env.get('GATEWAY1_URL') + '/transactions', {method: "POST", 
        headers:{"Content-Type": "application/json", Authorization: `Bearer ${token_auth}`},
        body: JSON.stringify({"amount": data.amount, "name": data.name,
        "email": data.email,
        "cardNumber": data.cardNumber,
        "cvv": data.cvv})})
        const dt = await response.json() as ChargeResponse
        return dt
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