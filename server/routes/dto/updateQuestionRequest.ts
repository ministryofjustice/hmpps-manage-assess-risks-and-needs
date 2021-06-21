import QuestionRule from './questionRules'

interface UpdateQuestionRequest {
  questionText: string
  helpText: string
  type: string
  answerGroup: string
  oasysQuestionCode: string
  referenceDataCategory: string
  questionRules: string[]
}

export function isReadOnly(updateQuestionRequest: UpdateQuestionRequest): boolean {
  return updateQuestionRequest.questionRules.includes(QuestionRule.READ_ONLY)
}

export function isMandatory(updateQuestionRequest: UpdateQuestionRequest): boolean {
  return updateQuestionRequest.questionRules.includes(QuestionRule.MANDATORY)
}

export default UpdateQuestionRequest
