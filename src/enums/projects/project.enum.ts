export enum EProjectStatus {
  DRAFT = 'DRAFT',
  PREPARED = 'PREPARED',
  READY = 'READY',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ENDED = 'ENDED',
  FREEZED = 'FREEZED',
  SUSPEND = 'SUSPEND',
}

export enum ESortByOther {
  POPULAR = 'POPULAR',
  RAISED = 'RAISED',
  APY = 'APY',
  CLOSING = 'CLOSING',
  ISSUE_DATE = 'ISSUE_DATE',
}

export enum EProjectVersion {
  ORIGINAL = 'ORIGINAL',
  REVISED = 'REVISED',
}

export enum EProjectSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum EProjectStatusFilter {
  LIVE = 'LIVE',
  READY = 'READY',
  PREPARED = 'PREPARED',
  ENDED = 'ENDED',
}

export enum EProjectEndedStatus {
  ALL_ENDED = 'ALL_ENDED',
  FULLY_FUNDED = 'FULLY_FUNDED',
  PARTIALLY_FUNDED = 'PARTIALLY_FUNDED',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
  SUSPENDED = 'SUSPENDED',
}
