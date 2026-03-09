import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Client from './client.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Gateway from './gateway.ts'
import Product from './product.ts'

export default class Transaction extends BaseModel {

    public static table = 'transactions'

    @column({isPrimary: true})
    declare id: number

    @column()
    declare external_id: number

    @column()
    declare gateway_id: number

    @column()
    declare status: string

    @column()
    declare amount: number
    
    @column()
    declare card_last_numbers: number

    @column()
    declare product_id: number

    @column()
    declare quantity: number

    @column()
    declare client_id: number

    @belongsTo(() => Client, {foreignKey: 'client_id'})
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway, {foreignKey: 'gateway_id'})
    declare gateway: BelongsTo<typeof Gateway>

    @belongsTo(() => Product, {foreignKey: 'product_id'})
    declare product: BelongsTo<typeof Product>

}

