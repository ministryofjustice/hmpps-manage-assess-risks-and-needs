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

  const withQuestionUuid = (uuid: string) => ({
    where: {
      questionSchemaUuid: uuid,
    },
  })
  const withContentUuid = (uuid: string) => ({
    where: {
      contentUuid: uuid,
    },
  })

  router.get('/question/:questionUuid', async (req, res) => {
    try {
      const [question] = await questionRepository.find(withQuestionUuid(req.params.questionUuid))
      const [questionGroupEntity] = await questionGroupRepository.find(withContentUuid(req.params.questionUuid))
      res.render('pages/question', {
        heading: 'Question',
        subHeading: 'Properties',
        question: [
          { name: 'Question', value: question.questionText },
          { name: 'Help Text', value: question.questionHelpText },
          { name: 'Answer Type', value: question.answerType },
          { name: 'Question Code', value: question.questionCode },
          { name: 'OASys Code', value: question.oasysQuestionCode },
          { name: 'Reference Data', value: question.referenceDataCategory },
          { name: 'Mandatory', value: questionGroupEntity.mandatory ? 'Yes' : 'No' },
          { name: 'Readonly', value: questionGroupEntity.readOnly ? 'Yes' : 'No' },
        ],
        validation: questionGroupEntity.validation
          ? Object.entries(JSON.parse(questionGroupEntity.validation)).map(([name, messages]) => ({
              name,
              messages,
            }))
          : null, // 🤷‍♂️ Just parsing the validation - will refactor
      })
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

  const whereGroupUuid = (uuid: string) => ({
    where: {
      groupUuid: uuid,
    },
  })

  type QuestionGroupEntity = {
    questionSchemaUuid?: string
    groupUuid?: string
  }

  const withUuids = (uuids: Array<QuestionGroupEntity>) => ({
    where: uuids,
  })

  router.get('/questions/group/:groupUuid', async (req, res) => {
    try {
      const [questionGroup] = await groupingRepository.find(whereGroupUuid(req.params.groupUuid))

      const contentInGroup = await questionGroup.contents

      const contentPositions = new Map<string, number>()
      contentInGroup.forEach(({ contentUuid, displayOrder }) => {
        contentPositions.set(contentUuid, displayOrder)
      })

      // Get questions
      const questionUuids = contentInGroup
        .filter(({ contentType }) => contentType === 'question')
        .map(({ contentUuid }) => ({ questionSchemaUuid: contentUuid }))

      const questions = questionUuids.length > 0 ? await questionRepository.find(withUuids(questionUuids)) : []

      const formattedQuestions = questions.map(
        ({ questionText, questionHelpText, questionSchemaUuid, answerType, questionCode, oasysQuestionCode }) => ({
          heading: questionText,
          helpText: questionHelpText,
          type: answerType,
          contentUuid: questionSchemaUuid,
          displayOrder: contentPositions.get(questionSchemaUuid),
          questionCode,
          oasysQuestionCode,
        })
      )

      // Get groups
      const groupUuids = contentInGroup
        .filter(({ contentType }) => contentType === 'group')
        .map(({ contentUuid }) => ({ groupUuid: contentUuid }))

      const groups = groupUuids.length > 0 ? await groupingRepository.find(withUuids(groupUuids)) : []

      const formattedGroups = groups.map(({ heading, helpText, groupUuid }) => ({
        heading,
        helpText,
        type: 'Group',
        contentUuid: groupUuid,
        displayOrder: contentPositions.get(groupUuid),
      }))

      res.render('pages/group', {
        heading: questionGroup.heading,
        subHeading: 'Content in the group',
        components: [...formattedQuestions, ...formattedGroups].sort((a, b) => a.displayOrder - b.displayOrder),
      })
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  router.get('/assessments', async (req, res) => {
    try {
      const schema = String(process.env.DATABASE_SCHEMA)
      const results: Array<Grouping> = await groupingRepository.query(
        'SELECT "heading", "subheading", "group_uuid" AS "groupUuid", "group_code" AS "groupCode", "help_text" AS "help_text" ' +
          `FROM "${schema}"."grouping" ` +
          `WHERE "group_uuid" NOT IN (SELECT DISTINCT "content_uuid" FROM "${schema}"."question_group")`
      )
      res.render('pages/groupings', {
        heading: 'Assessments',
        rows: results.map(({ heading, subheading, groupCode, groupUuid }) => ({
          heading,
          subheading,
          groupCode,
          groupUuid,
        })),
      })
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  return router
}
