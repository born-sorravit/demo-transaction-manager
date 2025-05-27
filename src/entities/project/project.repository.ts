import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EProjectStatus } from 'src/enums/projects/project.enum';
import { ProjectsEntity } from './project.entity';
import { SelectColumnProjects } from 'src/types/projects/project.type';
import { CreateProjectDto } from 'src/modules/common-gateway/project/dto/create-project.dto';

@Injectable()
export class ProjectsRepository extends Repository<ProjectsEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectsEntity, dataSource.createEntityManager());
  }

  async findOneWithRelations(
    id: string,
    transactionEntityManager?: EntityManager,
  ): Promise<ProjectsEntity | null> {
    const queryBuilder = transactionEntityManager
      ? transactionEntityManager.createQueryBuilder(ProjectsEntity, 'project')
      : this.createQueryBuilder('project');

    return await queryBuilder
      .leftJoinAndSelect('project.socialMedias', 'socialMedias')
      .leftJoinAndSelect('project.projectDates', 'projectDates')
      .select(SelectColumnProjects)
      .where('project.id = :id', { id })
      .getOne();
  }

  async findOneWithRelationsBySlug(
    slug: string,
    transactionEntityManager?: EntityManager,
  ): Promise<ProjectsEntity | null> {
    const queryBuilder = transactionEntityManager
      ? transactionEntityManager.createQueryBuilder(ProjectsEntity, 'project')
      : this.createQueryBuilder('project');

    return await queryBuilder
      .leftJoinAndSelect('project.socialMedias', 'socialMedias')
      .leftJoinAndSelect('project.projectDates', 'projectDates')
      .select(SelectColumnProjects)
      .where('project.slug = :slug', { slug })
      .getOne();
  }

  async createWithTransaction(
    transactionEntityManager: EntityManager,
    data: CreateProjectDto,
  ): Promise<ProjectsEntity | null> {
    const project = transactionEntityManager.create(ProjectsEntity, {
      name: data.name,
      description: data.description,
      softCap: data.softCap,
      hardCap: data.hardCap,
      chainId: data.chainId,
      apy: data.apy,
      pricePerToken: data.pricePerToken,
      totalSupply: data.totalSupply,
      status: EProjectStatus.DRAFT,
      whitePaperUrl: data.whitePaperUrl,
      contractAddress: data.contractAddress,
      userId: data.userId,
      publishDate: data.publishDate,
      minBuy: data.minBuy,
      maxBuy: data.maxBuy,
      slug: data.slug,
      viewCount: 0,
      minInvestor: data.minInvestor,
      amountInvested: 0,
    });
    return await transactionEntityManager.save(ProjectsEntity, project);
  }
}
