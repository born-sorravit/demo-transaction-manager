import { EProjectDateType } from 'src/enums/project-date/project-date.enum';
import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProjectsEntity } from '../project/project.entity';

@Entity('project_date')
export class ProjectDateEntity extends DefaultBaseEntity {
  @Column({ type: 'enum', enum: EProjectDateType, nullable: false })
  type: EProjectDateType;

  @Column({ name: 'start_date_time', nullable: false, type: 'timestamptz' })
  startDateTime: Date;

  @Column({ name: 'end_date_time', nullable: false, type: 'timestamptz' })
  endDateTime: Date;

  // Relation with project
  @ManyToOne(() => ProjectsEntity, (project) => project.projectDates)
  project: ProjectsEntity;
}
