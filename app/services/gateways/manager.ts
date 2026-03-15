import Gateway1Service from './gateway1_service.js'
import Gateway2Service from './gateway2_service.js'
import { GatewayInterface, ChargeData, ChargeResponse } from './interface.js'
import Gateway from '#models/gateway'

const gatewayMap: Record<string, new () => GatewayInterface> = {
  'Gateway 1': Gateway1Service,
  'Gateway 2': Gateway2Service,
}

export default class GatewayManager {
    
  async charge(data: ChargeData): Promise<{response: ChargeResponse, gatewayName: string}> {
    const gateways = await Gateway.query().where('active_is', true).orderBy('priority','asc')
      for (const gateway of gateways) {
        try {
            const ServiceClass = gatewayMap[gateway.name]
            const service = new ServiceClass()
            const result = await service.charge(data)
            return {response: result, gatewayName: gateway.name}
        } catch (e: any) {
          console.error(`[GatewayManager] o ${gateway.name} falhou:`, e.message)
        }
      }
      
      throw new Error('Todos os gateways falharam')
    }
    
  async refund (gatewayId: number, externalId: string): Promise<void> {
    const gateway = await Gateway.findOrFail(gatewayId)
    const ServiceClass = gatewayMap[gateway.name]
    if(!ServiceClass){
      throw new Error (`Gateway "${gateway.name}" não encontrado`)
    }
    const service = new ServiceClass()
    await service.refund(externalId)
  }
}