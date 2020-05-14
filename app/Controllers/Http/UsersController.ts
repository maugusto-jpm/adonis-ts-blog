import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

import User from "App/Models/User"
import Token from 'App/Models/Token';

export default class UsersController {
  public async index({ response }: HttpContextContract): Promise<void> {
    response.json(await User.all())
  }

  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      name: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    const user = new User()
    user.email = userDetails.email
    user.name = userDetails.name
    user.password = userDetails.password
    await user.setPassword(userDetails.password)

    await Database.transaction(async (trx: TransactionClientContract) => {
      user.useTransaction(trx)
      await user.save()

      const token = await Token.createLoginTokenForUser(user);
      token.useTransaction(trx)
      await token.save()

    })
    await auth.login(user, false)
    response.redirect('/dashboard')
  }
}
