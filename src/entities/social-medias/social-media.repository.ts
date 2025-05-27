import { DataSource, EntityManager, Repository } from 'typeorm';
import { SocialMediaEntity } from './social-media.entity';
import { Injectable } from '@nestjs/common';
import { ISocialMedias } from 'src/interfaces/social-medias/social-medias.interface';

@Injectable()
export class SocialMediaRepository extends Repository<SocialMediaEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SocialMediaEntity, dataSource.createEntityManager());
  }

  async createWithTransaction(
    transactionEntityManager: EntityManager,
    data: ISocialMedias[],
  ): Promise<SocialMediaEntity[] | null> {
    const socialMedias = transactionEntityManager.create(
      SocialMediaEntity,
      data,
    );
    return await transactionEntityManager.save(SocialMediaEntity, socialMedias);
  }
}
