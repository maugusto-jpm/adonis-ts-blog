import { BaseModel, column, beforeCreate, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import crypto from 'crypto'

import User from './User'
import Database from '@ioc:Adonis/Lucid/Database'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder'

export enum TokenTypes {
  login = 'login',
  resetPassword = 'resetPassword',
}

export default class Token extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ columnName: 'user_id', serializeAs: null })
  public userId: number

  @column()
  public token: string

  @column({ serializeAs: null })
  public type: TokenTypes

  @column({ serializeAs: null })
  public revoked: boolean

  @column.dateTime({ columnName: 'valid_until', serializeAs: null })
  public validUntil: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasOne(() => User)
  public user: HasOne<typeof User>

  @beforeCreate()
  public static generateRandomToken(token: Token): void {
    token.token = crypto.randomBytes(20).toString('hex');
  }

  public static valid(): DatabaseQueryBuilderContract<Token> {
    return Database.from('tokens')
      .where('revoked', false)
      .where((query: DatabaseQueryBuilderContract) => {
        query.whereNull('valid_until')
        .orWhere('valid_until', '>=', DateTime.utc().toSQL())
      })
  }

  public static async findLoginTokenToUser(user: User): Promise<Token|null> {
    return Token.valid()
      .where('type', 'login')
      .where('user_id', user.id)
      .first()
  }

  public static async createLoginTokenForUser(user: User): Promise<Token> {
    const token = new Token()
    token.userId = user.id
    token.type = TokenTypes.login
    token.validUntil = DateTime.local().plus({ months: 3 })

    return token
  }
}
