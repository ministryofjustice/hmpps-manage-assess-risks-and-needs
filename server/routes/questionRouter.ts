import { Router } from 'express'
import { getManager, Repository } from 'typeorm'
import logger from '../../logger'
import AnswerGroup from '../repositories/entities/answerGroup'
import AssessmentSchemaGroups from '../repositories/entities/assessmentSchemaGroup'
import Grouping from '../repositories/entities/grouping'
import Question from '../repositories/entities/question'
import QuestionDependency from '../repositories/entities/questionDependency'
import QuestionGroup from '../repositories/entities/questionGroup'
import { getAnswerTypes } from './dto/answerTypes'
import { questionResponseFrom } from './dto/questionResponse'
import UpdateQuestionRequest, { isMandatory, isReadOnly } from './dto/updateQuestionRequest'

export default function questionRouter(
  questionRepository: Repository<Question>,
  questionGroupRepository: Repository<QuestionGroup>,
  groupingRepository: Repository<Grouping>,
  answerGroupRepository: Repository<AnswerGroup>,
  questionDependencyRepository: Repository<QuestionDependency>,
  assessmentRepository: Repository<AssessmentSchemaGroups>
): Router {
  const router = Router({ mergeParams: true })

  router.use((req, res, next) => {
    res.locals.csrf = req.csrfToken()
    next()
  })

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

  router.get('/question/dependencies', async (req, res) => {
    const questionDependencies = await questionDependencyRepository.find()

    res.json(
      await Promise.all(
        questionDependencies.map(async q => {
          return {
            id: q.dependencyId,
            displayInline: q.displayInline,
            subject: {
              question: await q.subjectQuestion,
            },
            trigger: {
              question: await q.triggerQuestion,
              when: q.triggerAnswerValue,
            },
          }
        })
      )
    )
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
          { name: 'Mandatory', value: questionGroupEntity.mandatory },
          { name: 'Readonly', value: questionGroupEntity.readOnly },
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
      const questionGroup = await groupingRepository.findOne(whereGroupUuid(req.params.groupUuid))

      const contentInGroup = await questionGroup.contents

      // Get questions
      const questionUuids = contentInGroup
        .filter(({ contentType }) => contentType === 'question')
        .map(({ contentUuid }) => ({ questionSchemaUuid: contentUuid }))

      const questions = questionUuids.length > 0 ? await questionRepository.find(withUuids(questionUuids)) : []

      const formattedQuestions = questions.map(
        ({
          questionText,
          questionHelpText,
          questionSchemaUuid,
          answerType,
          questionCode,
          oasysQuestionCode,
          answerSchema,
          subjects,
          targets,
        }) => {
          const [additionalInformation] = contentInGroup.filter(q => q.contentUuid === questionSchemaUuid)
          return {
            heading: questionText,
            helpText: questionHelpText,
            type: answerType,
            contentUuid: questionSchemaUuid,
            displayOrder: additionalInformation?.displayOrder,
            questionCode,
            oasysQuestionCode,
            answerGroup: answerSchema?.answerSchemaGroupUuid || null,
            answers: answerSchema?.answers.map(({ value, text }) => ({ value, text })),
            mandatory: additionalInformation?.mandatory,
            readOnly: additionalInformation?.readOnly,
            subjects,
            targets,
          }
        }
      )

      // Get groups
      const groupUuids = contentInGroup
        .filter(({ contentType }) => contentType === 'group')
        .map(({ contentUuid }) => ({ groupUuid: contentUuid }))

      const groups = groupUuids.length > 0 ? await groupingRepository.find(withUuids(groupUuids)) : []

      const formattedGroups = groups.map(({ heading, helpText, groupUuid }) => {
        const [additionalInformation] = contentInGroup.filter(q => q.contentUuid === groupUuid)
        return {
          heading,
          helpText,
          type: 'Group',
          contentUuid: groupUuid,
          displayOrder: additionalInformation?.displayOrder,
        }
      })

      // Get Answer groups

      type MultipleChoiceOption = { text: string; value: string | null }

      const answerGroups: Array<MultipleChoiceOption> = await answerGroupRepository.find().then(ag => [
        ...ag.map(({ answerSchemaGroupCode, answerSchemaGroupUuid }) => ({
          text: answerSchemaGroupCode,
          value: answerSchemaGroupUuid,
        })),
        { text: 'None', value: null },
      ])

      res.render('pages/group', {
        heading: questionGroup.heading,
        subHeading: 'Content in the group',
        groupUuid: req.params.groupUuid,
        answerTypes: getAnswerTypes(),
        answerGroups,
        components: [...formattedQuestions, ...formattedGroups].sort((a, b) => a.displayOrder - b.displayOrder),
      })
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  router.get('/assessments', async (req, res) => {
    try {
      const results: Array<AssessmentSchemaGroups> = await assessmentRepository.find()
      res.render('pages/groupings', {
        heading: 'Assessments',
        rows: results.map(({ assessmentSchema, group }) => ({
          heading: assessmentSchema?.assessmentName,
          subheading: '',
          groupCode: assessmentSchema?.assessmentSchemaCode,
          groupUuid: group?.groupUuid,
        })),
      })
    } catch (error) {
      res.status(error.status || 500).send(error.message)
    }
  })

  router.post('/questions/group/:groupUuid/update', async (req, res) => {
    const requestedOrder: Array<string> = req.body

    try {
      const group = await groupingRepository.findOne(whereGroupUuid(req.params.groupUuid))
      const contentInGroup = await group.contents

      if (requestedOrder.length !== contentInGroup.length) {
        logger.info(
          `Malformed request to update group order - Expected:  ${contentInGroup.length} Actual: ${requestedOrder.length}`
        )
        return res.status(400).send('Malformed request')
      }

      await getManager().transaction(async entityManager => {
        const reorderedQuestions = requestedOrder.map((contentUuid, i) => {
          const [question] = contentInGroup.filter(q => q.contentUuid === contentUuid)
          const requestedPosition = i + 1
          if (question.displayOrder !== requestedPosition) {
            logger.debug(`Adjusting order: ${question.displayOrder} => ${requestedPosition}`)
            question.displayOrder = requestedPosition
          }

          return question
        })

        return entityManager.save(reorderedQuestions)
      })

      return res.send('okay')
    } catch (error) {
      logger.info(`Failed to update group order - ${error.message}`)
      return res.status(500).send('We were unable to update the group order')
    }
  })

  router.post('/questions/:questionUuid/update', async (req, res) => {
    try {
      const updatedQuestion: UpdateQuestionRequest = req.body
      const question = await questionRepository.findOne(withQuestionUuid(req.params.questionUuid))
      const questionGroupEntity = await questionGroupRepository.findOne(withContentUuid(req.params.questionUuid))

      await getManager().transaction(async entityManager => {
        question.questionText = updatedQuestion.questionText
        question.questionHelpText = updatedQuestion.helpText
        question.answerType = updatedQuestion.type
        question.answerSchema = updatedQuestion.answerGroup
          ? await answerGroupRepository.findOne({ where: { answerSchemaGroupUuid: updatedQuestion.answerGroup } })
          : null
        question.oasysQuestionCode = updatedQuestion.oasysQuestionCode
        question.referenceDataCategory = updatedQuestion.referenceDataCategory

        await entityManager.save(question)

        questionGroupEntity.mandatory = isMandatory(updatedQuestion)
        questionGroupEntity.readOnly = isReadOnly(updatedQuestion)

        await entityManager.save(questionGroupEntity)
      })

      return res.render('pages/questionResponse', {
        question: questionResponseFrom(question, questionGroupEntity),
      })
    } catch (error) {
      logger.info(`Failed to update group order - ${error.message}`)
      return res.status(500).send('We were unable to update the group order')
    }
  })

  return router
}
