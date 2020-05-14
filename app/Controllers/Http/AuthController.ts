import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract): Promise<void> {
    const email = request.input('email')
    const password = request.input('password')
    const rememberUser = !!request.input('remember_me')
    console.log(request.all());

    await auth.attempt(email, password, rememberUser)

    response.redirect('/dashboard')
  }

  public async logout({ response, auth }: HttpContextContract): Promise<void> {
    await auth.logout()

    response.redirect('/')
  }
}
