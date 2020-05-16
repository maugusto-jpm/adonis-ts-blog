import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import faker from 'faker';

import User from "App/Models/User"
import Post from 'App/Models/Post';

export default class UsersController {
  public async index({ response }: HttpContextContract): Promise<void> {
    response.json(await User.all())
  }

  public async store({ response }: HttpContextContract): Promise<void> {
    console.log('Creating users and posts');
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
  }
}
