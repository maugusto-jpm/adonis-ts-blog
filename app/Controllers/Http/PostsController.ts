import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'
import Post from 'App/Models/Post'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PostsController {
  public async index({ view }: HttpContextContract): Promise<string> {
    const posts: Post[] = await Database.from('posts').orderBy('created_at', 'desc').limit(20)

    return view.render('pages/home', { posts: posts })
  }

  public async create({ request, response, session, auth }: HttpContextContract): Promise<void> {
    const user = await auth.authenticate()
    const postInfo = await request.validate(PostValidator)

    const post = new Post()
    post.title = postInfo.title
    post.title = postInfo.title
    post.userId = user.id
    await post.save()

    session.flash('success', 'Postagem salva com sucesso')
    response.redirect('/')
  }

  public async update({ request, response, session }: HttpContextContract): Promise<void> {
    const postInfo = await request.validate(PostValidator)

    const post = await Post.findOrFail(postInfo.id)
    post.title = postInfo.title
    post.title = postInfo.title
    await post.save()

    session.flash('success', 'Postagem editada com sucesso')
    response.redirect('/')
  }
}
