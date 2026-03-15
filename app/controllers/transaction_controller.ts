import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import GatewayManager from '#services/gateways/manager'

export default class TransactionController {

  // GET /api/transactions
  async index({ response }: HttpContext) {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (q) => q.preload('productRelation'))
    return response.ok({ transactions })
  }

  // GET /api/transactions/:id
  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (q) => q.preload('productRelation'))
      .firstOrFail()
    return response.ok({ transaction })
  }

  // POST /api/transactions/:id/refund
  async refund({ params, response }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)

    if (transaction.status === 'refunded') {
      return response.badRequest({ message: 'Transação já foi reembolsada.' })
    }

    const manager = new GatewayManager()
    await manager.refund(transaction.gatewayId, transaction.externalId)

    transaction.status = 'refunded'
    await transaction.save()

    return response.ok({ transaction })
  }
}