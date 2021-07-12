import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type Question from './question'

@Entity({ name: 'oasys_question_mapping' })
export default class QuestionMapping {
  @PrimaryGeneratedColumn({ name: 'mapping_id' })
  mappingId: number

  @Column({ name: 'mapping_uuid', type: 'uuid' })
  mappingUuid: string

  @Column({ name: 'ref_section_code' })
  sectionCode: string

  @Column({ name: 'ref_question_code' })
  questionCode: string

  @Column({ name: 'logical_page' })
  logicalPage: number

  @Column({ name: 'fixed_field' })
  fixedField: boolean

  @ManyToOne('Question', 'questionSchemaUuid', { eager: false })
  @JoinColumn({ name: 'question_schema_uuid', referencedColumnName: 'questionSchemaUuid' })
  questionSchemaUuid: Question
}
