import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { gatewayValidator } from '#validators/gateway'
 
export default class GatewayController {
 
  // PATCH /api/gateways/:id/toggle
  async toggle({ params, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    gateway.activeIs = !gateway.activeIs
    await gateway.save()
    return response.ok({ gateway })
  }
 
  // PATCH /api/gateways/:id/priority
  async priority({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    //const { priority } = request.body()
    const { priority } = await request.validateUsing(gatewayValidator)
    gateway.priority = priority
    await gateway.save()
    return response.ok({ gateway })
  }
}