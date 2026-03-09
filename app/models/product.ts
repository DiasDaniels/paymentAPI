import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {

    public static table = 'products'

    @column({isPrimary: true})
    declare id: number

    @column()
    declare name: string

    @column()
    declare amount: number

}