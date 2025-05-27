import {
  EProjectStatus,
  EProjectVersion,
  ESortByOther,
} from 'src/enums/projects/project.enum';

export const SelectColumnProjects = [
  'project.id',
  'project.name',
  'project.description',
  'project.softCap',
  'project.hardCap',
  'project.chainId',
  'project.apy',
  'project.pricePerToken',
  'project.totalSupply',
  'project.status',
  'project.whitePaperUrl',
  'project.contractAddress',
  'project.userId',
  'project.publishDate',
  'project.minBuy',
  'project.maxBuy',
  'project.slug',
  'project.viewCount',
  'project.minInvestor',
  'project.amountInvested',
  'project.jobId',
  'project.hadLive',
  'project.hasMint',
  'project.createdAt',
  'project.updatedAt',
  'project.suspendedAt',
  'socialMedias.id',
  'socialMedias.type',
  'socialMedias.url',
  'projectDates.id',
  'projectDates.type',
  'projectDates.startDateTime',
  'projectDates.endDateTime',
];

export interface ISearchProjectOption {
  projectName?: string;
  projectStatus?: EProjectStatus;
  category?: string;
  sort?: 'ASC' | 'DESC';
  sortByOther?: ESortByOther;
}

export interface IBSearchProjectOptionBof {
  projectName?: string;
  projectStatus?: EProjectStatus;
}

export interface ISearchProjectVersionOption {
  version: EProjectVersion;
}
