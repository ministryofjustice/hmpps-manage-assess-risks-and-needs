import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type AssessmentSchema from './assessmentSchema'
import type Grouping from './grouping'

@Entity({ name: 'assessment_schema_groups' })
export default class AssessmentSchemaGroups {
  @PrimaryGeneratedColumn({ name: 'assessment_schema_group_id' })
  assessmentSchemaGroupId: number

  @ManyToOne('AssessmentSchema', 'assessmentSchemaUuid', { eager: true })
  @JoinColumn({ name: 'assessment_schema_uuid', referencedColumnName: 'assessmentSchemaUuid' })
  assessmentSchema: AssessmentSchema

  @ManyToOne('Grouping', 'groupUuid', { eager: true })
  @JoinColumn({ name: 'group_uuid', referencedColumnName: 'groupUuid' })
  group: Grouping
}
