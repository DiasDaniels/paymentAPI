import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gateway.createMany([
      {
        name: 'Gateway 1',
        activeIs: true,
        priority: 1,
      },
      {
        name: 'Gateway 2',
        activeIs: true,
        priority: 2,
      }
    ])
  }
}