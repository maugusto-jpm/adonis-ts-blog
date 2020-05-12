import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'
import { DateTime } from 'luxon'

import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({
    columnName: 'password_hash',
    prepare: (value: string) => Encryption.encrypt(value)
  })
  public passwordHash: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public posts: HasMany<typeof Token>
}
