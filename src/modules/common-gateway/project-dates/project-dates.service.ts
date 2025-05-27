import { Injectable } from '@nestjs/common';
import { CreateProjectDateDto } from './dto/create-project-date.dto';
import { UpdateProjectDateDto } from './dto/update-project-date.dto';

@Injectable()
export class ProjectDatesService {
  create(createProjectDateDto: CreateProjectDateDto) {
    return 'This action adds a new projectDate';
  }

  findAll() {
    return `This action returns all projectDates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectDate`;
  }

  update(id: number, updateProjectDateDto: UpdateProjectDateDto) {
    return `This action updates a #${id} projectDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectDate`;
  }
}
