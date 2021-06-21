type MultipleChoiceOption = { text: string; value: string | null }
type MultipleChoiceOptions = Array<MultipleChoiceOption>

enum AnswerTypes {
  FREETEXT = 'freetext',
  TEXT_AREA = 'textarea',
  DATE = 'date',
  NUMERIC = 'numeric',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  YES_NO = 'y/n',
  DROPDOWN = 'dropdown',
  SCALE = 'scale',
  HEADING_REGULAR = 'presentation: heading',
  HEADING_LARGE = 'presentation: heading_large',
  DIVIDER = 'presentation: divider',
  INSET = 'presentation: inset',
  CHILDREN_AT_RISK_TABLE = 'table:children_at_risk_of_serious_harm',
  CHILDREN_AT_RISK_ADD_ROW = 'presentation: buttonlink("<base>/addrow/children_at_risk_of_serious_harm")',
  UPDATE_ASSESSMENT_LINK = 'presentation: link("/update-assessment")',
}

export function getAnswerTypes(): MultipleChoiceOptions {
  return [
    { text: 'Freetext ', value: AnswerTypes.FREETEXT },
    { text: 'Text area ', value: AnswerTypes.TEXT_AREA },
    { text: 'Date ', value: AnswerTypes.DATE },
    { text: 'Numeric ', value: AnswerTypes.NUMERIC },
    { text: 'Radio ', value: AnswerTypes.RADIO },
    { text: 'Checkbox ', value: AnswerTypes.CHECKBOX },
    { text: 'Yes/No ', value: AnswerTypes.YES_NO },
    { text: 'Dropdown ', value: AnswerTypes.DROPDOWN },
    { text: 'Scale ', value: AnswerTypes.SCALE },
    { text: 'Heading ', value: AnswerTypes.HEADING_REGULAR },
    { text: 'Heading (Large) ', value: AnswerTypes.HEADING_LARGE },
    { text: 'Divider ', value: AnswerTypes.DIVIDER },
    { text: 'Inset ', value: AnswerTypes.INSET },
    { text: 'Children at Risk - Table ', value: AnswerTypes.CHILDREN_AT_RISK_TABLE },
    { text: 'Children at Risk - Add Row ', value: AnswerTypes.CHILDREN_AT_RISK_ADD_ROW },
    { text: 'Update assessment link ', value: AnswerTypes.UPDATE_ASSESSMENT_LINK },
  ]
}

export default AnswerTypes
