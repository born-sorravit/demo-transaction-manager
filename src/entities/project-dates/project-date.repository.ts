import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectDateEntity } from './project-date.entity';
import { Injectable } from '@nestjs/common';
import { IProjectDate } from 'src/interfaces/project-dates/project-dates.interface';

@Injectable()
export class ProjectDateRepository extends Repository<ProjectDateEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProjectDateEntity, dataSource.createEntityManager());
  }

  async craeteWithTransaction(
    transactionEntityManager: EntityManager,
    data: IProjectDate[],
  ): Promise<ProjectDateEntity[] | null> {
    const projectDate = transactionEntityManager.create(
      ProjectDateEntity,
      data,
    );
    return await transactionEntityManager.save(projectDate);
  }
}
