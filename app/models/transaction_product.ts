import {belongsTo } from '@adonisjs/lucid/orm'
import Product from './product.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TransactionProductSchema } from '#database/schema'

export default class TransactionProduct extends TransactionProductSchema {

    public static table = 'transaction_products'

    @belongsTo(() => Product, {foreignKey: 'product_id'})
    declare productId: BelongsTo<typeof Product>

}