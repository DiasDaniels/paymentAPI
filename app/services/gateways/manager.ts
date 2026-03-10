import Gateway1Service from './gateway1_service.js'
import Gateway2Service from './gateway2_service.js'
import { GatewayInterface, ChargeData, ChargeResponse } from './interface.js'
import Gateway from '#models/gateway'

const gatewayMap: Record<string, new () => GatewayInterface> = {
  'Gateway 1': Gateway1Service,
  'Gateway 2': Gateway2Service,
}

export default class GatewayManager {
    async charge(data: ChargeData): Promise<ChargeResponse> {
    const gateways = await Gateway.query().where('active_is', true).orderBy('priority','asc')
      for (const gateway of gateways) {
        try {
            const ServiceClass = gatewayMap[gateway.name]
            const service = new ServiceClass()
            return await service.charge(data)
        } catch (e) {
          console.log(e)
        }
      }
      
      throw new Error('Todos os gateways falharam')
    }
}