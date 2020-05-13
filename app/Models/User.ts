import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'

import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ columnName: 'password_hash' })
  public passwordHash: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  // public async loginToken(): Promise<Token> {

  // }

  public async setPassword(password: string): Promise<void> {
    this.passwordHash = await Hash.hash(password)
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return Hash.verify(this.passwordHash, password);
  }
}
