import type { HasMany } from '@adonisjs/lucid/types/relations'
import { ClientSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import Transaction from './transaction.ts'

export default class Client extends ClientSchema {

    public static table = 'clients'
    
    @hasMany (() => Transaction)
    declare transactions: HasMany<typeof Transaction>

}