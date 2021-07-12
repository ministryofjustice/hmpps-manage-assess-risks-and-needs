import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import type Answer from './answer'
import type Question from './question'

@Entity({ name: 'answer_schema_group' })
export default class AnswerGroup {
  @PrimaryGeneratedColumn({ name: 'answer_schema_group_id' })
  answerSchemaGroupId: number

  @Column({ name: 'answer_schema_group_uuid', type: 'uuid' })
  answerSchemaGroupUuid: string

  @Column({ name: 'answer_schema_group_code' })
  answerSchemaGroupCode: string

  @OneToMany('Answer', 'answerSchemaGroup', { eager: true })
  answers: Array<Answer>

  @OneToMany('Question', 'questionSchemaUuid', { eager: false })
  questions: Promise<Array<Question>>
}
