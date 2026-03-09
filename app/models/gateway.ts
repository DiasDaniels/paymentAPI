import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Gateway extends BaseModel {

    public static table = 'gateways'

    @column()
    declare name: string

    @column()
    declare active_is: boolean

    @column()
    declare priority: number

    @column({isPrimary: true})
    declare id: number
}