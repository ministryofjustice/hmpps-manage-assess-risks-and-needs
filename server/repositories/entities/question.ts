import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'question_schema' })
export default class Question {
  @PrimaryGeneratedColumn({ name: 'question_schema_id' })
  questionSchemaId: number

  @Column({ name: 'question_schema_uuid', type: 'uuid' })
  questionSchemaUuid: string

  @Column({ name: 'question_text' })
  questionText: string
}
