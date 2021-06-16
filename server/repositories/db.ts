import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import logger from '../../logger'
import Grouping from './entities/grouping'
import Question from './entities/question'
import QuestionGroup from './entities/questionGroup'

type ConnectionResult = [Error?, Connection?]

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: String(process.env.DATABASE_HOST),
  schema: String(process.env.DATABASE_SCHEMA),
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: String(process.env.DATABASE_USER),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
  entities: [Grouping, QuestionGroup, Question],
  migrationsRun: Boolean(process.env.DATABASE_RUN_MIGRATIONS) || false,
  migrations: ['dist/db/migrations/*.js'],
  extra: {
    ssl: Boolean(process.env.DATABASE_USE_SSL) || false,
  },
}

export default async function getDatabaseConnection(): Promise<ConnectionResult> {
  try {
    const connection = await createConnection(connectionOptions)
    return [null, connection]
  } catch (error) {
    logger.error(`Failed to get database connection: ${error.message}`)
    return [error]
  }
}
