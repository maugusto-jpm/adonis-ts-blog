import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ session, response }: HttpContextContract): Promise<void> {
    session.flash('error', 'Teste de mensagem de erro')
    session.flash('info', 'Teste de mensagem de informação')
    response.redirect('/postagens')
  }
}
