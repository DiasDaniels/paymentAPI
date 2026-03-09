import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TransactionProduct extends BaseModel {

    public static table = 'transaction_products'

    @column({isPrimary: true})
    declare id: number

    @column()
    declare name: string

    @column()
    declare quantity: number

}