import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserAlreadyLoggedException from 'App/Exceptions/UserAlreadyLoggedException'

export default class UserNotLogged {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>): Promise<void> {
    if (ctx.auth.user) throw new UserAlreadyLoggedException('User already logged')

    await next()
  }
}
