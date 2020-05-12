import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export enum TokenTypes {
  login,
  resetPassword
}

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id' })
  public userId: number

  @column()
  public token: string

  @column()
  public type: TokenTypes

  @column({ columnName: 'valid_until' })
  public validUntil: Date

  @column()
  public revoked: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime
}
