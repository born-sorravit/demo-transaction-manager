import { ProjectsEntity } from 'src/entities/project/project.entity';
import { EProjectDateType } from 'src/enums/project-date/project-date.enum';

export interface IProjectDate {
  type: EProjectDateType;
  startDateTime: Date;
  endDateTime: Date;
  project?: ProjectsEntity;
}

export interface IUpdateProjectDateDto {
  id?: string;
  type: EProjectDateType;
  startDateTime: Date;
  endDateTime: Date;
}
