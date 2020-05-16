import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'
import { DateTime } from 'luxon'

import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ view, session }: HttpContextContract): Promise<string> {
    const posts: Post[] = await Post.query().preload('user').orderBy('updated_at', 'desc').limit(20)

    session.flash('error', 'Usuário ou senha inválidos')
    return view.render('pages/home', {
      posts: posts.map((post) => post.toJSON()),
      separateTextInParagraphs: (text: string) => text.split(/\r\n|\n|\r/),
      formatDateTime: (datetimeString: string) =>
        DateTime.fromISO(datetimeString).toFormat('HH:mm dd/MM/yyyy'),
    })
  }

  public async newPost(
      {
        auth,
        view,
        response,
        session,
      }: HttpContextContract
    ): Promise<string|void> {
    if (await auth.check()) return view.render('pages/create-post')

    session.flash('info', 'Entre ou crie uma conta para fazer uma postagem')
    response.redirect('/entrar')
  }

  public async create({ request, response, session, auth }: HttpContextContract): Promise<void> {
    const user = await auth.authenticate()
    const postInfo = await request.validate(PostValidator)

    const post = new Post()
    post.title = postInfo.title
    post.title = postInfo.title
    post.userId = user.id
    await post.save()

    session.flash('info', 'Postagem salva')
    response.redirect('/')
  }

  public async update({ request, response, session }: HttpContextContract): Promise<void> {
    const postInfo = await request.validate(PostValidator)

    const post = await Post.findOrFail(postInfo.id)
    post.title = postInfo.title
    post.title = postInfo.title
    await post.save()

    session.flash('info', 'Postagem alterada')
    response.redirect('/')
  }
}
