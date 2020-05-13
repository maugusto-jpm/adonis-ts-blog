import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Token from 'App/Models/Token'

export default class SessionsController {
  public async index({ request, response }: HttpContextContract): Promise<any> {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }),
    })

    const loginDetails = await request.validate({
      schema: validationSchema,
    })

    const user = await User.findByOrFail('email', loginDetails.email)
    if (!await user.verifyPassword(loginDetails.password)) return response.status(401)

    let token = await Token.findLoginTokenToUser(user)
    if (token === null) token = await Token.createLoginTokenForUser(user)

    return {
      token: token.token
    }
  }
}
