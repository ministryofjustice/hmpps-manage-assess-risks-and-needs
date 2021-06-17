import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type AnswerGroup from './answerGroup'

@Entity({ name: 'answer_schema' })
export default class Answer {
  @PrimaryGeneratedColumn({ name: 'answer_schema_id' })
  answerSchemaId: number

  @Column({ name: 'answer_schema_uuid', type: 'uuid' })
  answerSchemaUuid: string

  @Column({ name: 'answer_schema_code' })
  answerSchemaCode: string

  @Column({ name: 'value' })
  value: string

  @Column({ name: 'text' })
  text: string

  @ManyToOne('AnswerGroup', 'questions', { eager: false })
  @JoinColumn({ name: 'answer_schema_group_uuid', referencedColumnName: 'answerSchemaGroupUuid' })
  answerSchemaGroup: AnswerGroup
}
