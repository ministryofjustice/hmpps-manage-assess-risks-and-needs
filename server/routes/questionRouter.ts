import { Router } from 'express'
import { Repository } from 'typeorm'
import Question from '../repositories/entities/question'

export default function questionRouter(questionRepository: Repository<Question>): Router {
  const router = Router({ mergeParams: true })

  router.get('/questions', async (req, res) => {
    try {
      const results = await questionRepository.find()
      res.json(results)
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  return router
}
