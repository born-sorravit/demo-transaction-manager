import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectDatesService } from './project-dates.service';
import { CreateProjectDateDto } from './dto/create-project-date.dto';
import { UpdateProjectDateDto } from './dto/update-project-date.dto';

@Controller('project-dates')
export class ProjectDatesController {
  constructor(private readonly projectDatesService: ProjectDatesService) {}

  @Post()
  create(@Body() createProjectDateDto: CreateProjectDateDto) {
    return this.projectDatesService.create(createProjectDateDto);
  }

  @Get()
  findAll() {
    return this.projectDatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDateDto: UpdateProjectDateDto) {
    return this.projectDatesService.update(+id, updateProjectDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDatesService.remove(+id);
  }
}
