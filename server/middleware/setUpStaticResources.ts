import path from 'path'
import compression from 'compression'
import express, { RequestHandler, Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 }
  ;[
    '/assets',
    '/assets/stylesheets',
    '/assets/js',
    '/node_modules/govuk-frontend/govuk/assets',
    '/node_modules/govuk-frontend',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/jquery/dist',
    '/node_modules/sortablejs',
    '/node_modules/dompurify',
  ].forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl) as RequestHandler)
  })
  ;['/node_modules/govuk_frontend_toolkit/images'].forEach(dir => {
    router.use('/assets/images/icons', express.static(path.join(process.cwd(), dir), cacheControl) as RequestHandler)
  })
  ;['/node_modules/jquery/dist/jquery.min.js'].forEach(dir => {
    router.use(
      '/assets/js/jquery.min.js',
      express.static(path.join(process.cwd(), dir), cacheControl) as RequestHandler
    )
  })

  // Don't cache dynamic resources
  router.use(noCache() as RequestHandler)

  return router
}
