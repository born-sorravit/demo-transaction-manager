import { Module } from '@nestjs/common';
import { ProjectDatesService } from './project-dates.service';
import { ProjectDatesController } from './project-dates.controller';

@Module({
  controllers: [ProjectDatesController],
  providers: [ProjectDatesService]
})
export class ProjectDatesModule {}
