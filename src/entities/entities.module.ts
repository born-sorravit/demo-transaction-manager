import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleRepository } from './example/example.repository';
import { ExampleEntity } from './example/example.entity';
import { ProjectsEntity } from './project/project.entity';
import { ProjectsRepository } from './project/project.repository';
import { ProjectDateEntity } from './project-dates/project-date.entity';
import { ProjectDateRepository } from './project-dates/project-date.repository';
import { SocialMediaEntity } from './social-medias/social-media.entity';
import { SocialMediaRepository } from './social-medias/social-media.repository';

const Entitys = [
  ExampleEntity,
  ProjectsEntity,
  ProjectDateEntity,
  SocialMediaEntity,
];
const Repositorys = [
  ExampleRepository,
  ProjectsRepository,
  ProjectDateRepository,
  SocialMediaRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([...Entitys])],
  providers: [...Repositorys],
  exports: [...Repositorys],
})
export class EntitiesModule {}
