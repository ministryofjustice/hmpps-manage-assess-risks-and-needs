import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type Question from './question'

@Entity({ name: 'question_dependency' })
export default class QuestionDependency {
  @PrimaryGeneratedColumn({ name: 'dependency_id' })
  dependencyId: number

  @ManyToOne('Question', 'question', { eager: false })
  @JoinColumn({ name: 'subject_question_uuid', referencedColumnName: 'questionSchemaUuid' })
  subjectQuestion: Promise<Question>

  @ManyToOne('Question', 'question', { eager: false })
  @JoinColumn({ name: 'trigger_question_uuid', referencedColumnName: 'questionSchemaUuid' })
  triggerQuestion: Promise<Question>

  @Column({ name: 'trigger_answer_value' })
  triggerAnswerValue: string

  @Column({ name: 'dependency_start' })
  startDate: Date = null

  @Column({ name: 'dependency_end' })
  endDate: Date = null

  @Column({ name: 'display_inline' })
  displayInline: boolean
}
