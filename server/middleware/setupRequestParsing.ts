import express, { RequestHandler, Router } from 'express'

export default function setUpWebRequestParsing(): Router {
  const router = express.Router()
  router.use(express.json() as RequestHandler)
  router.use(express.urlencoded({ extended: true }) as RequestHandler)
  return router
}
