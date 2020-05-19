import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'
import { DateTime } from 'luxon'

import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ request, view }: HttpContextContract): Promise<string> {
    const { page: pageParam } = request.get()
    const page = parseInt(pageParam || '1')

    const postsPagination = await Post.query()
      .preload('user')
      .orderBy('updated_at', 'desc')
      .paginate(
        page,
        10
      )
    const posts = postsPagination.all().map((post) => post.toJSON())
    const splitTextInParagraphs = (text: string): string[] => text.split(/\r\n|\n|\r/)
    const formatDateTime = (datetimeString: string): string =>
      DateTime.fromISO(datetimeString).toFormat('HH:mm dd/MM/yyyy')

    const lastPage = postsPagination.lastPage
    const minPage = Math.max(1, page - 3)
    const maxPage = Math.min(lastPage, page + 3)
    const pageIndexes: number[] = Array
      .from({ length: 14 }, (_, k) => k + page - 6)
      .filter((number) =>
        number >= Math.min(minPage, minPage - ((page + 3) - maxPage)) &&
        number <= Math.max(maxPage, maxPage + ((page - 4) * -1))
      )

    return view.render('pages/home', {
      showing: postsPagination.currentPage * postsPagination.perPage,
      total: postsPagination.total,
      currentPage: page,
      lastPage,
      pageIndexes,
      posts,
      splitTextInParagraphs,
      formatDateTime,
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

    session.flash({ info: 'Postagem salva' })
    response.redirect('/')
  }

  public async update({ request, response, session }: HttpContextContract): Promise<void> {
    const postInfo = await request.validate(PostValidator)

    const post = await Post.findOrFail(postInfo.id)
    post.title = postInfo.title
    post.title = postInfo.title
    await post.save()

    session.flash({ info: 'Postagem alterada' })
    response.redirect('/')
  }
}
