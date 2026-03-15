import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'Teclado Mecânico',
        amount: 350.50, // Lembre-se, o amount é decimal
      },
      {
        name: 'Monitor 24"',
        amount: 800.00,
      }
    ])
  }
}