import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'tyke.db.elephantsql.com',
  port: 5432,
  username: 'jkcnlxiw',
  password: 'tW0TRAotQAlGknBEZh3hvDGP1aNtJZDq',
  database: 'jkcnlxiw',
  entities: ['dist/infra/postgres/entities/index.js']
}
