import express from 'express'

import createError from 'http-errors'

import indexRoutes from './routes'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import standardRouter from './routes/standardRouter'

import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpWebRequestParsing from './middleware/setupRequestParsing'

export default function createApp(): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)

  app.use('/', indexRoutes(standardRouter()))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
