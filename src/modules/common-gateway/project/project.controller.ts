import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { IPaginateOptions } from 'src/utils/paginate';
import { ISearchProjectOption } from 'src/types/projects/project.type';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  findAll(
    @Query() paginateOpt: IPaginateOptions,
    @Query() searchProjectOpt: ISearchProjectOption,
  ) {
    return this.projectService.findAll(paginateOpt, searchProjectOpt);
  }

  @Post('/create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.projectService.softDeleteProject(id);
  }
}
