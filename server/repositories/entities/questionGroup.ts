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
  mandatory = false

  @Column({ name: 'validation' })
  validation: string = null

  @Column({ name: 'read_only' })
  readOnly = false

  @ManyToOne('Grouping', 'contents', { eager: false })
  @JoinColumn({ name: 'group_uuid', referencedColumnName: 'groupUuid' })
  group: Grouping
}
