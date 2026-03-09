import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Client extends BaseModel {

    public static table = 'clients'

    @column()
    declare email: string

    @column()
    declare name: string

    @column({isPrimary: true})
    declare id: number


}