import { ProjectsEntity } from 'src/entities/project/project.entity';
import { ESocialMediaType } from 'src/enums/social-medias/social-medias.enum';

export interface ISocialMedias {
  type: ESocialMediaType;
  url: string;
  project?: ProjectsEntity;
}

export interface IUpdateSocialMediasDto {
  id?: string;
  type: ESocialMediaType;
  url: string;
}
