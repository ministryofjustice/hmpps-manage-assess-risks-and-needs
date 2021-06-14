import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import type QuestionGroup from './questionGroup'

@Entity({ name: 'grouping' })
export default class Grouping {
  @PrimaryGeneratedColumn({ name: 'group_id' })
  groupId: number

  @Column({ name: 'group_uuid', type: 'uuid' })
  groupUuid: string

  @Column({ name: 'group_code' })
  groupCode: string

  @Column({ name: 'heading' })
  heading: string

  @Column({ name: 'subheading' })
  subheading: string

  @Column({ name: 'help_text' })
  helpText: string

  @Column({ name: 'group_start' })
  groupStart: Date

  @Column({ name: 'group_end' })
  groupEnd: Date

  @OneToMany('QuestionGroup', 'group', { eager: true })
  contents: Array<QuestionGroup>
}
