import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example
| new UserAlreadyLoggedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UserAlreadyLoggedException extends Exception {
  public async handle(_error: any, ctx: HttpContextContract): Promise<any> {
    ctx.session.flash('error', 'Você já está autenticado')

    return ctx.response.redirect('/postagens')
  }
}
