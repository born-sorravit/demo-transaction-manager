import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { ProjectsEntity } from 'src/entities/project/project.entity';
import { EProjectStatus, ESortByOther } from 'src/enums/projects/project.enum';
import { EProjectDateType } from 'src/enums/project-date/project-date.enum';
import { IPaginateOptions, paginate } from 'src/utils/paginate';

import {
  ISearchProjectOption,
  SelectColumnProjects,
} from 'src/types/projects/project.type';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProjectsRepository } from 'src/entities/project/project.repository';
import { ConfigService } from '@nestjs/config';
import { CreateProjectDto } from './dto/create-project.dto';
import { sanitizeSlug } from 'src/utils/sanitize-slug';
import { IProjectDate } from 'src/interfaces/project-dates/project-dates.interface';
import * as dayjs from 'dayjs';
import { ProjectDateRepository } from 'src/entities/project-dates/project-date.repository';
import { SocialMediaRepository } from 'src/entities/social-medias/social-media.repository';

@Injectable()
export class ProjectService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Repositories
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectDateRepository: ProjectDateRepository,
    private readonly socialMediasRepository: SocialMediaRepository,

    // Services
    private configService: ConfigService,
  ) {
    super();
  }

  async findAll(
    paginateOpt: IPaginateOptions,
    searchProjectOpt: ISearchProjectOption,
  ): Promise<IResponse<ProjectsEntity[]>> {
    try {
      const projectsBuilder = this.projectsRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.socialMedias', 'socialMedias')
        .leftJoinAndSelect('project.projectDates', 'projectDates')
        .select(SelectColumnProjects);

      if (searchProjectOpt.projectName) {
        // ถ้าส่ง filter project name return ตาม projects ตาม project name
        projectsBuilder.andWhere('LOWER(project.name) LIKE :name', {
          name: `%${searchProjectOpt.projectName.toLocaleLowerCase()}%`,
        });
      }

      // sort by other
      if (searchProjectOpt.sortByOther) {
        // TODO : wait for discuss spec
        if (
          searchProjectOpt.sortByOther.toUpperCase() ===
          ESortByOther.POPULAR.toUpperCase()
        ) {
          // ถ้าส่ง filter sort by other ที่เป็น MOST_POPULAR return โดยเรียงตาม viewCount
          projectsBuilder.orderBy(
            'project.viewCount',
            searchProjectOpt.sort
              ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
              : 'ASC',
          );
        } else if (
          searchProjectOpt.sortByOther.toUpperCase() ===
          ESortByOther.RAISED.toUpperCase()
        ) {
          // ถ้าส่ง filter sort by other ที่เป็น HIGHEST_RAISED return โดยเรียงตาม raisedAmount
          projectsBuilder.orderBy(
            'project.amountInvested',
            searchProjectOpt.sort
              ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
              : 'ASC',
          );
        } else if (
          searchProjectOpt.sortByOther.toUpperCase() ===
          ESortByOther.APY.toUpperCase()
        ) {
          // ถ้าส่ง filter sort by other ที่เป็น HIGHEST_APY return โดยเรียงตาม apy
          projectsBuilder.orderBy(
            'project.apy',
            searchProjectOpt.sort
              ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
              : 'ASC',
          );
        } else if (
          searchProjectOpt.sortByOther.toUpperCase() ===
          ESortByOther.CLOSING.toUpperCase()
        ) {
          // ถ้าส่ง filter sort by other ที่เป็น CLOSING_SOON return โดยเรียงตาม closingDate
          projectsBuilder
            .leftJoinAndSelect('project.projectDates', 'pdo')
            .andWhere('UPPER(pdo.type::text) = :type', {
              type: EProjectDateType.LIVE.toUpperCase(),
            })
            .addOrderBy(
              'pdo.endDateTime',
              searchProjectOpt.sort
                ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
                : 'ASC',
            )
            .addOrderBy('pdo.startDateTime', 'DESC')
            .addOrderBy('project.name', 'ASC');
        }
      }

      // filter project status
      if (
        searchProjectOpt.projectStatus?.toUpperCase() ===
          EProjectStatus.LIVE.toUpperCase() ||
        !searchProjectOpt.projectStatus
      ) {
        // ถ้าไม่ส่ง filter project status return default เป็น LIVE
        const baseQuery = projectsBuilder.andWhere(
          'project.status IN (:...status)',
          {
            status: [EProjectStatus.LIVE, EProjectStatus.FREEZED],
          },
        );
        // sort by startDateTime live and return all project dates
        this.sortQuery(
          baseQuery,
          searchProjectOpt.sort
            ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
            : 'ASC',
          EProjectStatus.LIVE,
          // NOTE : ส่ง sortByOther ไปเพื่อเรียงตาม viewCount ถ้าไม่ส่งไป spec การเรียงลำดับ จะ confict กับตอนที่ส่ง sort by popular มา code จะทำงานไม่ถูกต้อง
          searchProjectOpt.sortByOther &&
            searchProjectOpt.sortByOther.toUpperCase() ===
              ESortByOther.POPULAR.toUpperCase() &&
            ESortByOther.POPULAR,
        );
      } else {
        if (
          searchProjectOpt.projectStatus.toUpperCase() ===
          EProjectStatus.READY.toUpperCase()
        ) {
          // ถ้าส่ง filter project status ที่เป็น UPCOMING  return project ที่เป็น READY
          const baseQuery = projectsBuilder.andWhere(
            '(project.status::text) = :status',
            {
              status: EProjectStatus.READY,
            },
          );

          // sort by startDateTime live and return all project dates
          this.sortQuery(
            baseQuery,
            searchProjectOpt.sort
              ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
              : 'ASC',
            EProjectStatus.READY,
          );
        } else if (
          searchProjectOpt.projectStatus.toUpperCase() ===
          EProjectStatus.ENDED.toUpperCase()
        ) {
          // ถ้าส่ง filter project status ที่เป็น ENDED  return project ที่เป็น ENDED และ Suspended
          const baseQuery = projectsBuilder.andWhere(
            'project.status IN (:...status)',
            {
              status: [
                EProjectStatus.COMPLETED,
                EProjectStatus.FAILED,
                EProjectStatus.SUSPEND,
              ],
            },
          );

          // sort by endDateTime live and return all project dates
          this.sortQuery(
            baseQuery,
            searchProjectOpt.sort
              ? (searchProjectOpt.sort?.toUpperCase() as 'ASC' | 'DESC')
              : 'ASC',
            EProjectStatus.ENDED,
          ).andWhere('project.hadLive = :hadLive', { hadLive: true });
        } else {
          // ถ้าส่ง filter project status return ตามที่ส่งมา
          projectsBuilder.where('UPPER(project.status::text) = :status', {
            status: searchProjectOpt.projectStatus.toUpperCase(),
          });
        }
      }

      const paginateData = await paginate<ProjectsEntity>(
        projectsBuilder,
        paginateOpt,
      );
      return this.paginate(paginateData.data, paginateData.meta);
    } catch (error) {
      return this.error(error.message as string);
    }
  }

  sortQuery(
    baseQuery: SelectQueryBuilder<ProjectsEntity>,
    sort: 'ASC' | 'DESC',
    projectStatus?: EProjectStatus,
    sortByOther?: ESortByOther,
  ) {
    const finalQuery = baseQuery
      .leftJoinAndSelect('project.projectDates', 'pd')
      .leftJoin('project.projectDates', 'pds')
      .addSelect(['pds.id', 'pds.type', 'pds.startDateTime', 'pds.endDateTime'])
      .andWhere('UPPER(pd.type::text) = :type', {
        type: EProjectDateType.LIVE.toUpperCase(),
      });

    if (projectStatus === EProjectStatus.ENDED) {
      // ถ้า project status เป็น ENDED ให้ sort by endDateTime default เป็น ASC
      return finalQuery
        .addOrderBy('pd.endDateTime', sort || 'ASC')
        .addOrderBy('project.status', 'ASC')
        .addOrderBy('project.name', 'ASC');
    } else if (projectStatus === EProjectStatus.LIVE) {
      // NOTE : เช็ค sortByOther ไปเพื่อเรียงตาม viewCount ถ้าไม่ส่งไป spec การเรียงลำดับ จะ confict กับตอนที่ส่ง sort by popular มา code จะทำงานไม่ถูกต้อง
      let sortPopular: 'ASC' | 'DESC' = 'DESC';
      if (sortByOther === ESortByOther.POPULAR) {
        sortPopular = sort;
      }
      // ถ้า project status เป็น LIVE ให้ sort by startDateTime default เป็น DESC , viewCount เป็น ASC และ project name เป็น DESC
      return finalQuery
        .addOrderBy('pd.endDateTime', sort || 'DESC')
        .addOrderBy('project.viewCount', sortPopular)
        .addOrderBy('project.name', 'ASC');
    } else if (projectStatus === EProjectStatus.READY) {
      // ถ้า project status เป็น READY ให้ sort by startDateTime default เป็น ASC , publishDate เป็น DESC และ project name เป็น DESC
      return finalQuery
        .addOrderBy('pd.startDateTime', sort || 'DESC')
        .addOrderBy('project.viewCount', 'DESC')
        .addOrderBy('project.name', 'ASC');
    } else {
      // ถ้า project status ไม่เท่ากับ ENDED, LIVE หรือไม่ส่่ง status ให้ sort by startDateTime default เป็น DESC
      return finalQuery
        .addOrderBy('pd.startDateTime', sort || 'DESC')
        .addOrderBy('project.name', 'ASC');
    }
  }

  async create(createProjectDto: CreateProjectDto) {
    try {
      createProjectDto.apy = createProjectDto.apy ?? 0; // Default to 0 if not provided

      // Check slug
      if (createProjectDto.slug) {
        // เช็ค forrmat ให้ใส่ได้แค่ - ถ้าใส่ต้องเหนือจาก - ให้ตัดออก หรือหากใส่ " " มาให้ replace ด้วย -
        const sanitized = sanitizeSlug(createProjectDto.slug);
        if (sanitized.length === 0)
          throw new BadRequestException('Project slug format error');
        createProjectDto.slug = sanitized;
      }

      // Check duplicate project
      const project = await this.projectsRepository.findOne({
        where: [
          { name: createProjectDto.name },
          { slug: createProjectDto.slug },
        ],
      });

      if (project) {
        throw new BadRequestException(
          'Project with the same name or slug already exists',
        );
      }

      // If hard cap not set then hard cap = soft cap
      if (!createProjectDto.hardCap) {
        createProjectDto.hardCap = createProjectDto.softCap;
      }

      // // Check soft cap > hard cap ?
      if (
        createProjectDto.hardCap > 0 &&
        createProjectDto.softCap > createProjectDto.hardCap
      ) {
        throw new BadRequestException('Soft cap must be less than hard cap');
      }

      // Check min buy > max buy ?
      if (createProjectDto.minBuy > createProjectDto.maxBuy) {
        throw new BadRequestException('Min buy must be less than max buy');
      }

      // Check social medias from client
      if (createProjectDto.socialMedias.length < 0) {
        throw new BadRequestException(`Social medias can't be null`);
      }

      // Check project date (live, claim, refund)
      const hasAllTypes = this.validateProjectDates(
        createProjectDto.projectDates,
      );

      if (!hasAllTypes) {
        throw new BadRequestException(
          'All project date types (LIVE, CLAIM, REFUND) must be present exactly once.',
        );
      }

      // Validate date
      this.validateExcuteTime(
        createProjectDto.publishDate,
        createProjectDto.projectDates,
      );

      this.validatePeriodData(
        createProjectDto.publishDate,
        createProjectDto.projectDates,
      );

      // Create project and relation table
      return await this.manager.transaction(
        async (transactionEntityManager) => {
          // create project
          const project = await this.projectsRepository.createWithTransaction(
            transactionEntityManager,
            createProjectDto,
          );

          // create social medias
          await this.socialMediasRepository.createWithTransaction(
            transactionEntityManager,
            createProjectDto.socialMedias.map((socialMedia) => ({
              ...socialMedia,
              project,
            })),
          );

          // create project date
          await this.projectDateRepository.craeteWithTransaction(
            transactionEntityManager,
            createProjectDto.projectDates.map((projectDate) => ({
              ...projectDate,
              project,
            })),
          );

          // find new project
          const newProject = await this.projectsRepository.findOneWithRelations(
            project.id,
            transactionEntityManager,
          );

          return this.success(newProject);
        },
      );
    } catch (error) {
      return this.error(error.message as string);
    }
  }

  async softDeleteProject(id: string) {
    try {
      // TODO : check permission admin

      const project = await this.projectsRepository.findOneWithRelations(id);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return await this.manager.transaction(
        async (transactionEntityManager) => {
          // Soft delete project
          const softRemoveproject = await transactionEntityManager.softDelete(
            ProjectsEntity,
            id,
          );

          if (!softRemoveproject) {
            throw new NotFoundException(
              `Couldn't soft delete project. Because project not found or already deleted`,
            );
          }

          return this.success({
            message: 'Project deleted successfully',
            data: project,
          });
        },
      );
    } catch (error) {
      return this.error(error.message as string);
    }
  }

  validateProjectDates(projectDates: IProjectDate[]): boolean {
    if (projectDates.length <= 0) {
      return false;
    }
    const types = projectDates.map((date) => date.type);

    const requiredTypes = [
      EProjectDateType.LIVE,
      EProjectDateType.CLAIM,
      EProjectDateType.REFUND,
    ];

    // Check if all required types are present and are unique
    if (
      requiredTypes.every((type) => types.includes(type)) &&
      requiredTypes.every(
        (type) => types.filter((t) => t === type).length === 1,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateExcuteTime(publishDate?: Date, projectDates?: IProjectDate[]) {
    if (publishDate) {
      // Check publish date must not be in the past
      if (dayjs(publishDate).isBefore(dayjs())) {
        throw new BadRequestException('Publish date must not be in the past.');
      }
    }

    if (projectDates && projectDates.length > 0) {
      // Check project date start and end date must not be in the past
      for (const date of projectDates) {
        const start = dayjs(date.startDateTime);
        const end = dayjs(date.endDateTime);

        if (start.isBefore(dayjs())) {
          throw new Error(
            `${date.type} startDateTime must not be in the past.`,
          );
        }

        if (end.isBefore(dayjs())) {
          throw new Error(`${date.type} endDateTime must not be in the past.`);
        }

        if (end.isBefore(start)) {
          throw new Error(
            `${date.type} endDateTime must be after startDateTime.`,
          );
        }
      }
    }
  }

  validatePeriodData(publishDate: Date, projectDates: IProjectDate[]) {
    const isLive = projectDates.find(
      (projectDate) => projectDate.type === EProjectDateType.LIVE,
    );

    const isClaim = projectDates.find(
      (projectDate) => projectDate.type === EProjectDateType.CLAIM,
    );

    const isRefund = projectDates.find(
      (projectDate) => projectDate.type === EProjectDateType.REFUND,
    );

    if (publishDate) {
      // Validate publish date
      const newPublishDate = dayjs(publishDate).diff(
        dayjs(isLive.startDateTime),
        'day',
      );

      // Check is publishdate 14 days from now
      const publishDatePeriod = 14;
      if (newPublishDate > publishDatePeriod) {
        throw new BadRequestException(
          'Publish date cannot be more than 14 days from the LIVE startDateTime .',
        );
      }
    }

    const maxEndDate = dayjs(isLive.startDateTime).diff(
      dayjs(isLive.endDateTime),
      'day',
    );

    if (maxEndDate > 180) {
      throw new BadRequestException(
        'Live period cannot exceed 180 days from the start date.',
      );
    }

    // check if live start date < live end date
    if (!dayjs(isLive.startDateTime).isBefore(dayjs(isLive.endDateTime))) {
      throw new BadRequestException('Live end date must be after start date');
    }

    // check if claim start date < claim end date
    if (!dayjs(isClaim.startDateTime).isBefore(dayjs(isClaim.endDateTime))) {
      throw new BadRequestException('Claim end date must be after start date');
    }

    // check if refund start date < refund end date
    if (!dayjs(isRefund.startDateTime).isBefore(dayjs(isRefund.endDateTime))) {
      throw new BadRequestException('Refund end date must be after start date');
    }

    // check if live end date < claim start date
    if (!dayjs(isLive.endDateTime).isBefore(dayjs(isClaim.startDateTime))) {
      throw new BadRequestException(
        'Claim start date must be after live end date',
      );
    }

    // check if live end date < refund start date
    if (!dayjs(isLive.endDateTime).isBefore(dayjs(isRefund.startDateTime))) {
      throw new BadRequestException(
        'Refund start date must be after live end date',
      );
    }

    // Check if CLAIM period is not exceeding 30 days
    if (isClaim) {
      const claimDuration = dayjs(isClaim.endDateTime).diff(
        dayjs(isClaim.startDateTime),
        'day',
      );
      if (claimDuration > 30) {
        throw new BadRequestException('Claim period cannot exceed 30 days.');
      }
    }

    // Check if REFUND period is not exceeding 30 days
    if (isRefund) {
      const refundDuration = dayjs(isRefund.endDateTime).diff(
        dayjs(isRefund.startDateTime),
        'day',
      );
      if (refundDuration > 30) {
        throw new BadRequestException('Refund period cannot exceed 30 days.');
      }
    }
  }
}
