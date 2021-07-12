import type Question from '../../repositories/entities/question'
import type QuestionGroup from '../../repositories/entities/questionGroup'

type MultipleChoiceOption = { text: string; value: string | null }
type MultipleChoiceOptions = Array<MultipleChoiceOption>

type QuestionResponse = {
  heading: string
  helpText: string
  type: string
  contentUuid: string
  displayOrder: number
  questionCode: string
  answers: MultipleChoiceOptions
  mandatory: boolean
  readOnly: boolean
}

export function questionResponseFrom(question: Question, questionGroup: QuestionGroup): QuestionResponse {
  return {
    heading: question.questionText,
    helpText: question.questionHelpText,
    type: question.answerType,
    contentUuid: question.questionSchemaUuid,
    displayOrder: questionGroup.displayOrder,
    questionCode: question.questionCode,
    answers: question.answerSchema?.answers.map(({ value, text }): MultipleChoiceOption => ({ value, text })),
    mandatory: questionGroup.mandatory,
    readOnly: questionGroup.readOnly,
  }
}

export default QuestionResponse
