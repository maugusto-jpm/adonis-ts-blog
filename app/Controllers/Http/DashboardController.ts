import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  public async index({ response, auth }: HttpContextContract): Promise<void> {
    const user = await auth.authenticate()

    response.json(user.serialize())
  }
}
