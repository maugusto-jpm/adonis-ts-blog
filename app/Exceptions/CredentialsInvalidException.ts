import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import url from 'url'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example
| new CredentialsInvalidException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class CredentialsInvalidException extends Exception {
  public async handle(_error: any, ctx: HttpContextContract): Promise<any> {
    ctx.session.flash('info', 'Para prosseguir é necessário se autenticar')

    const redirectUrl = url.format({
    host: '/entrar',
      query: {
        redirectTo: ctx.request.url(true),
      }
    });

    return ctx.response.redirect(redirectUrl)
  }
}
