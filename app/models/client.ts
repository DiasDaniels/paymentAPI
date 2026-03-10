import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ClientSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'

export default class Client extends ClientSchema {

    public static table = 'clients'
    
    @belongsTo(() => User, {foreignKey: 'id'})
    declare user_id: BelongsTo<typeof User>

}