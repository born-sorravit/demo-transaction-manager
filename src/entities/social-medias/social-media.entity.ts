import { ProjectsEntity } from 'src/entities/project/project.entity';
import { ESocialMediaType } from 'src/enums/social-medias/social-medias.enum';
import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('social_media')
export class SocialMediaEntity extends DefaultBaseEntity {
  @Column({ type: 'enum', enum: ESocialMediaType, nullable: false })
  type: ESocialMediaType;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => ProjectsEntity, (project) => project.socialMedias)
  project: ProjectsEntity;
}
