import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import Transaction from '#models/transaction'

export default class ClientController {

  // GET /api/clients
  async index({ response }: HttpContext) {
    const clients = await Client.all()
    return response.ok({ clients })
  }

  // GET /api/clients/:id
  async show({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    const transactions = await Transaction.query()
      .where('client_id', client.id)
      .preload('transactionProducts', (q) => q.preload('productRelation'))
    return response.ok({ client, transactions })
  }
}