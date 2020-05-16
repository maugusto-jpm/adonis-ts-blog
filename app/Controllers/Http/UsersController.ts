import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class UsersController {
  public async login({ request, response, auth, session }: HttpContextContract): Promise<void> {
    const userDetails = await request.validate(LoginValidator)
    const rememberMe = !!request.input('remember_me') as boolean

    await auth.attempt(userDetails.email, userDetails.password, rememberMe)

    session.flash('info', `Você fez login como ${userDetails.email}`)
    const { redirectTo } = request.get()

    response.redirect(redirectTo || '/postagens')
  }

  public async store({ request, auth, session, response }: HttpContextContract): Promise<void> {
    const userDetails = await request.validate(SignupValidator)
    const rememberMe = !!request.input('remember_me') as boolean

    const user = new User()
    user.email = userDetails.email
    user.name = userDetails.name
    await user.setPassword(userDetails.password)
    await user.save()

    auth.login(user, rememberMe)

    session.flash('info', `Seja bem-vindo, ${userDetails.name}`)
    response.redirect('/postagens')
  }

  public async logout({ response, auth, session }: HttpContextContract): Promise<void> {
    await auth.logout()

    session.flash('info', 'Sua sessão foi encerrada')
    response.redirect('/postagens')
  }
}
