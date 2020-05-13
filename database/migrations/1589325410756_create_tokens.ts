import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTokens extends BaseSchema {
  protected tableName = 'tokens'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.boolean('user_id').notNullable().references('id').inTable('user')
      table.string('token', 512).notNullable()
      table.enum('type', ['login', 'resetPassword']).notNullable()
      table.boolean('revoked').defaultTo(false).notNullable()
      table.dateTime('valid_until').nullable()
      table.timestamps(true)
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
