import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('clients')
        .onDelete('RESTRICT')
      table
        .integer('gateway_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('gateways')
        .onDelete('RESTRICT')
      table.string('external_id').notNullable().comment('ID returned by the gateway')
      table.string('status').notNullable().defaultTo('pending')
      table.integer('amount').notNullable().comment('Total in cents')
      table.string('card_last_numbers', 4).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
