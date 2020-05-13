import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

import User from "App/Models/User"
import Token from 'App/Models/Token';

export default class UsersController {
  public async index(): Promise<any> {
    return User.all();
  }

  public async store({ request }: HttpContextContract): Promise<Token|void> {
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
    user.passwordHash = userDetails.password
    await user.setPassword(userDetails.password)

    await Database.transaction(async (trx) => {
      user.useTransaction(trx)
      await user.save()

      const token = await Token.createLoginTokenForUser(user);
      token.useTransaction(trx)
      await token.save()

      return token;
    })
  }
}
