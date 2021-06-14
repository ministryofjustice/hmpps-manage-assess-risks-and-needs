import { Router } from 'express'
import { Repository } from 'typeorm'
import Grouping from '../repositories/entities/grouping'
import Question from '../repositories/entities/question'
import QuestionGroup from '../repositories/entities/questionGroup'

export default function questionRouter(
  questionRepository: Repository<Question>,
  questionGroupRepository: Repository<QuestionGroup>,
  groupingRepository: Repository<Grouping>
): Router {
  const router = Router({ mergeParams: true })

  router.get('/questions', async (req, res) => {
    try {
      const results = await questionRepository.find()
      res.json(results)
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  router.get('/questions/groups', async (req, res) => {
    try {
      const results = await questionGroupRepository.find()
      res.json(results)
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  router.get('/groupings', async (req, res) => {
    try {
      const results = await groupingRepository.find()
      res.json(results)
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  return router
}
