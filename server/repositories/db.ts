import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import fs from 'fs'
import logger from '../../logger'
import Grouping from './entities/grouping'
import Question from './entities/question'
import QuestionGroup from './entities/questionGroup'
import Answer from './entities/answer'
import AnswerGroup from './entities/answerGroup'
import QuestionDependency from './entities/questionDependency'
import AssessmentSchema from './entities/assessmentSchema'
import AssessmentSchemaGroups from './entities/assessmentSchemaGroup'
import QuestionMapping from './entities/questionMapping'

type ConnectionResult = [Error?, Connection?]

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: String(process.env.DATABASE_HOST),
  schema: String(process.env.DATABASE_SCHEMA),
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: String(process.env.DATABASE_USER),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
  entities: [
    Grouping,
    QuestionGroup,
    QuestionMapping,
    Question,
    Answer,
    AnswerGroup,
    QuestionDependency,
    AssessmentSchema,
    AssessmentSchemaGroups,
  ],
  migrationsRun: Boolean(process.env.DATABASE_RUN_MIGRATIONS),
  migrations: ['dist/db/migrations/*.js'],
  ssl: process.env.DATABASE_USE_SSL
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/app/certs/eu-west-2-bundle.pem').toString(),
      }
    : false,
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
