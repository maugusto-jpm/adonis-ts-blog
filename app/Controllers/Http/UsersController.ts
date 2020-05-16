import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import faker from 'faker'

import User from "App/Models/User"
import Post from 'App/Models/Post'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class UsersController {

  public async login({ request, response, auth, session }: HttpContextContract): Promise<void> {
    const userDetails = await request.validate(LoginValidator)
    console.log(request.all())

    try {
      await auth.attempt(userDetails.email, userDetails.password)

      session.flash('info', `Você fez login como ${userDetails.email}`)
      response.redirect('/')
    }
    catch (error) {
      session.flash('error', 'Usuário ou senha inválidos')
      response.redirect('/')
    }
  }

  public async store({ request, auth, session, response }: HttpContextContract): Promise<void> {
    console.log(request.all())

    const userDetails = await request.validate(SignupValidator)

    const user = new User()
    user.email = userDetails.email
    user.name = userDetails.name
    await user.setPassword(userDetails.password)
    await user.save()

    auth.login(user)

    session.flash('info', `Seja bem-vindo, ${userDetails.name}`)
    response.redirect('/')
  }

  public async logout({ response, auth, session }: HttpContextContract): Promise<void> {
    await auth.logout()

    session.flash('info', 'Sua sessão foi encerrada')
    response.redirect('/')
  }

  private async populate({ response }: HttpContextContract): Promise<void> {
    console.log('Creating users and posts')
    const userLoopArray = Array.from(Array(10))

    // Users creation

    const userPromises = userLoopArray.map(async () => {
      console.log('Creating user')

      const user = new User()

      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const emailUserName = `${firstName.trim().toLowerCase()}-${lastName.trim().toLowerCase()}`
      const emailProvider = faker.internet.domainName()

      user.name = `${firstName} ${lastName}`
      user.email = `${emailUserName}@${emailProvider}`
      await user.setPassword(`${firstName}+${lastName}`)

      await user.save()
      await user.refresh()

      // Posts creation for this user

      const postArray = Array.from(Array(20))

      const postPromises = postArray.map(async () => {
        console.log('Creating post')

        const post = new Post()

        post.userId = user.id
        post.title = faker.lorem.sentence(faker.random.number({ min: 2, max: 7 }))
        post.content = faker.lorem.paragraphs(faker.random.number({ min: 1, max: 7 }))
        post.modified = faker.random.boolean()
        post.createdAt = DateTime.fromJSDate(faker.date.past())
        if (post.modified) {
          post.updatedAt = DateTime.fromJSDate(
            faker.date.between(
              post.createdAt.toISODate(),
              DateTime.local().toISODate()
            )
          )
        }
        else {
          post.updatedAt = post.createdAt
        }

        await post.save()
      })

      await Promise.all(postPromises)
    })

    await Promise.all(userPromises)
    console.log('Finished all')

    response.send('Concluído')
    response.redirect('/')
  }
}
