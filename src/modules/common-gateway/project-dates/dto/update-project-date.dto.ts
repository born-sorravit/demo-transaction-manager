import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDateDto } from './create-project-date.dto';

export class UpdateProjectDateDto extends PartialType(CreateProjectDateDto) {}
