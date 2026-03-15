import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Client from './client.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Gateway from './gateway.ts'
import Product from './product.ts'
import { TransactionSchema } from '#database/schema'
import TransactionProduct from './transaction_product.ts'

export default class Transaction extends TransactionSchema {

    public static table = 'transactions'

    @belongsTo(() => Client, {foreignKey: 'clientId'})
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway, {foreignKey: 'gatewayId'})
    declare gateway: BelongsTo<typeof Gateway>

    @belongsTo(() => Product, {foreignKey: 'productId'})
    declare product: BelongsTo<typeof Product>

    @hasMany(() => TransactionProduct)
    declare transactionProducts: HasMany<typeof TransactionProduct>

}

