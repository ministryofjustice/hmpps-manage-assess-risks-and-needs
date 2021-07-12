import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'assessment_schema' })
export default class AssessmentSchema {
  @PrimaryGeneratedColumn({ name: 'assessment_schema_id' })
  assessmentSchemaId: number

  @Column({ name: 'assessment_schema_uuid', type: 'uuid' })
  assessmentSchemaUuid: string

  @Column({ name: 'assessment_schema_code' })
  assessmentSchemaCode: string

  @Column({ name: 'oasys_assessment_type' })
  oasysAssessmentType: string

  @Column({ name: 'oasys_create_assessment_at' })
  oasysCreateAssessmentAt: string

  @Column({ name: 'assessment_name' })
  assessmentName: string
}
