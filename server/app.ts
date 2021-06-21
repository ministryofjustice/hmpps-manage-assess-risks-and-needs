import express, { Application } from 'express'

import path from 'path'
import createError from 'http-errors'
import 'reflect-metadata'

import { Connection } from 'typeorm'
import indexRoutes from './routes'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import standardRouter from './routes/standardRouter'
import questionRouter from './routes/questionRouter'
import type UserService from './services/userService'

import setUpWebSession from './middleware/setUpWebSession'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpAuthentication from './middleware/setUpAuthentication'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import Question from './repositories/entities/question'
import QuestionGroup from './repositories/entities/questionGroup'
import Grouping from './repositories/entities/grouping'
import AnswerGroup from './repositories/entities/answerGroup'

export default function createApplication(userService: UserService, databaseConnection: Connection): Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())

  const questionRepository = databaseConnection.getRepository(Question)
  const questionGroupRepository = databaseConnection.getRepository(QuestionGroup)
  const groupingRepository = databaseConnection.getRepository(Grouping)
  const answerGroupRepository = databaseConnection.getRepository(AnswerGroup)

  app.use('/', indexRoutes(standardRouter(userService)))
  app.use(
    '/',
    indexRoutes(questionRouter(questionRepository, questionGroupRepository, groupingRepository, answerGroupRepository))
  )

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
