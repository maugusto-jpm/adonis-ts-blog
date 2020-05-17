import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'
import { DateTime } from 'luxon'

import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ view }: HttpContextContract): Promise<string> {
    const posts: Post[] = await Post.query().preload('user').orderBy('updated_at', 'desc').limit(20)

    return view.render('pages/home', {
      posts: posts.map((post) => post.toJSON()),
      splitTextInParagraphs: (text: string) => text.split(/\r\n|\n|\r/),
      formatDateTime: (datetimeString: string) =>
        DateTime.fromISO(datetimeString).toFormat('HH:mm dd/MM/yyyy'),
    })
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
