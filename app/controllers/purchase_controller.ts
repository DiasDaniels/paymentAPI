import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import GatewayManager from '#services/gateways/manager'
import { purchaseValidator } from '#validators/purchase'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class Purchase {

  async store({ request, response }: HttpContext) {

    //const { name, email, cardNumber, cvv, products } = request.body()
    const data = await request.validateUsing(purchaseValidator)
    const productIds = data.products.map((p: any) => p.id)
    const productList = await Product.query().whereIn('id', productIds)

    let total = 0
    for (const item of data.products) {
      const product = productList.find((p) => p.id === item.id)
      if (product) total += product.amount * item.quantity
    }

    const manager = new GatewayManager()

    const { response: chargeResult, gatewayName } = await manager.charge({
      amount: total,
      name: data.name,
      email: data.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    const gateway = await Gateway.findByOrFail('name', gatewayName)

    const trx = await db.transaction()

    try {
      const client = await Client.firstOrCreate(
        { email: data.email },
        { name: data.name, email: data.email },
        { client: trx }
      )

      const transaction = await Transaction.create({
        clientId: client.id,
        gatewayId: gateway.id,
        externalId: chargeResult.id,
        status: chargeResult.status || 'approved',
        amount: total,
        cardLastNumbers: data.cardNumber.slice(-4),
      }, { client: trx })

      const transactionProductsPayload = data.products.map((item: any) => ({
        transactionId: transaction.id,
        productId: item.id,
        quantity: item.quantity,
      }))

      await TransactionProduct.createMany(transactionProductsPayload, { client: trx })

      await trx.commit()

      return response.created({ transaction })

    } catch (error) {

      await trx.rollback()

      console.error('[PurchaseController] Erro ao gravar transação no banco:', error)
      return response.internalServerError({ message: 'Erro ao registrar a transação no banco de dados.' })
    }
  }
}