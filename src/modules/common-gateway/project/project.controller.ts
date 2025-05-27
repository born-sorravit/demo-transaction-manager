import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { IPaginateOptions } from 'src/utils/paginate';
import { ISearchProjectOption } from 'src/types/projects/project.type';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) {}

  @Get('')
  findAll(
    @Query() paginateOpt: IPaginateOptions,
    @Query() searchProjectOpt: ISearchProjectOption,
  ) {
    return this.projectsService.findAll(paginateOpt, searchProjectOpt);
  }

  @Get('/:id')
  findOneByIdOrSlug(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post('/create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch('update-view-count/:id')
  async updateViewCount(@Param('id') id: string) {
    return this.projectsService.updateViewCount(id);
  }

  @Patch('reset-view-count/:id')
  resetViewCount(@Param('id') id: string) {
    return this.projectsService.resetViewCount(id);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.projectsService.softDeleteProject(id);
  }
}
