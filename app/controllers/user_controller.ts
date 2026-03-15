import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { signupValidator, updateUserValidator } from '#validators/user'

export default class UserController {

  // GET /api/users
  async index({ response }: HttpContext) {
    const users = await User.query().select('id', 'email', 'role', 'createdAt', 'updatedAt')
    return response.ok({ users })
  }

  // GET /api/users/:id
  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .select('id', 'email', 'role', 'createdAt', 'updatedAt')
      .where('id', params.id)
      .firstOrFail()
    return response.ok({ user })
  }

  // POST /api/users
  async store({ request, response }: HttpContext) {
    //const { email, password, role } = request.body()
    const data = await request.validateUsing(signupValidator)
    const user = await User.create({ email: data.email, password: data.password, role: data.role })
    return response.created({ user })
  }

  // PUT /api/users/:id
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    //const { email, password, role } = request.body()
    const data = await request.validateUsing(updateUserValidator)
    if (data.email) user.email = data.email
    if (data.password) user.password = await hash.make(data.password)
    if (data.role) user.role = data.role
    await user.save()
    return response.ok({ user })
  }

  // DELETE /api/users/:id
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok({ message: 'Usuário removido com sucesso.' })
  }
}