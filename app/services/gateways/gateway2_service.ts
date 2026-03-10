import env from "#start/env"
import { GatewayInterface, ChargeData, ChargeResponse } from "./interface.ts"

export default class Gateway2Service implements GatewayInterface {

async charge(data: ChargeData): Promise<ChargeResponse> {
        const response = await fetch (env.get('GATEWAY2_URL') + '/transacoes', {method: "POST", 
        headers:{"Content-Type": "application/json", "Gateway-Auth-Token": env.get("GATEWAY2_AUTH_TOKEN"), "Gateway-Auth-Secret": env.get("GATEWAY2_AUTH_SECRET")  },
        body: JSON.stringify({"valor": data.amount, "nome": data.name,
        "email": data.email,
        "numeroCartao": data.cardNumber,
        "cvv": data.cvv})})
        const dt = await response.json() as ChargeResponse
        return dt
        }
  
async refund(externalId: string): Promise<void> {
        const response = await fetch(env.get('GATEWAY2_URL') + `/transacoes/reembolso`, {method: "POST",
        headers: {"Content-Type": "application/json", "Gateway-Auth-Token": env.get("GATEWAY2_AUTH_TOKEN"), "Gateway-Auth-Secret": env.get("GATEWAY2_AUTH_SECRET") },
        body: JSON.stringify({id: externalId})})
        if(!response.ok) {
            throw new Error (`Algo deu errado: ${response.status}`)
        }
    }
} 