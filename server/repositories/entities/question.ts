import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import type AnswerGroup from './answerGroup'
import type QuestionDependency from './questionDependency'

@Entity({ name: 'question_schema' })
export default class Question {
  @PrimaryGeneratedColumn({ name: 'question_schema_id' })
  questionSchemaId: number

  @Column({ name: 'question_schema_uuid', type: 'uuid' })
  questionSchemaUuid: string

  @Column({ name: 'question_code' })
  questionCode: string

  @Column({ name: 'oasys_question_code' })
  oasysQuestionCode: string

  @Column({ name: 'external_source' })
  externalSource: string

  @Column({ name: 'question_start' })
  questionStartDate: Date

  @Column({ name: 'question_end' })
  questionEndDate: Date

  @Column({ name: 'answer_type' })
  answerType: string

  @Column({ name: 'question_text' })
  questionText: string

  @Column({ name: 'question_help_text' })
  questionHelpText: string

  @Column({ name: 'reference_data_category' })
  referenceDataCategory: string

  @ManyToOne('AnswerGroup', 'questions', { eager: true })
  @JoinColumn({ name: 'answer_schema_group_uuid', referencedColumnName: 'answerSchemaGroupUuid' })
  answerSchema: AnswerGroup | null

  @OneToMany('QuestionDependency', 'subjectQuestion', { eager: true })
  subjects: Array<QuestionDependency> | null

  @OneToMany('QuestionDependency', 'triggerQuestion', { eager: true })
  targets: Array<QuestionDependency> | null
}
