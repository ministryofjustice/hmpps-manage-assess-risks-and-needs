import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type Grouping from './grouping'

@Entity({ name: 'question_group' })
export default class QuestionGroup {
  @PrimaryGeneratedColumn({ name: 'question_group_id' })
  questionGroupId: number

  @Column({ name: 'question_group_uuid', type: 'uuid' })
  questionGroupUuid: string

  @Column({ name: 'content_uuid', type: 'uuid' })
  contentUuid: string

  @Column({ name: 'content_type' })
  contentType: string

  @Column({ name: 'display_order' })
  displayOrder: number

  @Column({ name: 'mandatory' })
  mandatory: boolean

  @Column({ name: 'validation' })
  validation: string

  @Column({ name: 'read_only' })
  readOnly: boolean

  @ManyToOne('Grouping', 'contents', { eager: false })
  @JoinColumn({ name: 'group_uuid', referencedColumnName: 'groupUuid' })
  group: Promise<Grouping>
}
