import express, { Router, Express } from 'express'
import createError from 'http-errors'

import allRoutes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import standardRouter from '../standardRouter'

function appSetup(route: Router, production: boolean): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)

  app.use((req, res, next) => {
    res.locals = {}
    next()
  })

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/', route)
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export default function appWithAllRoutes({ production = false }: { production?: boolean }): Express {
  return appSetup(allRoutes(standardRouter()), production)
}
