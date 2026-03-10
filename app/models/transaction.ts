import { belongsTo } from '@adonisjs/lucid/orm'
import Client from './client.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Gateway from './gateway.ts'
import Product from './product.ts'
import { TransactionSchema } from '#database/schema'

export default class Transaction extends TransactionSchema {

    public static table = 'transactions'

    @belongsTo(() => Client, {foreignKey: 'client_id'})
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway, {foreignKey: 'gateway_id'})
    declare gateway: BelongsTo<typeof Gateway>

    @belongsTo(() => Product, {foreignKey: 'product_id'})
    declare product: BelongsTo<typeof Product>

}

