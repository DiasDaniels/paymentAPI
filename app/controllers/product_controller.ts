import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { productValidator } from '#validators/product'

export default class ProductController {

  // GET /api/products
  async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok({ products })
  }

  // GET /api/products/:id
  async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return response.ok({ product })
  }

  // POST /api/products
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(productValidator)
    //const { name, amount } = request.body()
    const product = await Product.create(data)
    return response.created({ product })
  }

  // PUT /api/products/:id
  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    //const { name, amount } = request.body()
    const data = await request.validateUsing(productValidator)
    if (data.name) product.name = data.name
    if (data.amount !== undefined) product.amount = data.amount
    await product.save()
    return response.ok({ product })
  }

  // DELETE /api/products/:id
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.ok({ message: 'Produto removido com sucesso.' })
  }
}