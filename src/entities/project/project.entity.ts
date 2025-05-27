import { EProjectStatus } from 'src/enums/projects/project.enum';
import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProjectDateEntity } from '../project-dates/project-date.entity';
import { SocialMediaEntity } from '../social-medias/social-media.entity';

@Entity('projects')
export class ProjectsEntity extends DefaultBaseEntity {
  @Column({ length: 255, nullable: false, unique: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    name: 'soft_cap',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  softCap: number;

  @Column({
    name: 'hard_cap',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  hardCap: number;

  @Column({ name: 'chain_id', length: 255, nullable: false })
  chainId: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, nullable: false })
  apy: number;

  @Column({
    name: 'price_per_token',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  pricePerToken: number;

  @Column({
    name: 'total_supply',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  totalSupply: number;

  @Column({
    type: 'enum',
    enum: EProjectStatus,
    default: EProjectStatus.DRAFT,
    nullable: false,
  })
  status: EProjectStatus;

  @Column({ name: 'white_paper_url', length: 255, nullable: false })
  whitePaperUrl: string;

  @Column({ name: 'contract_address', length: 255 })
  contractAddress: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'publish_date', type: 'timestamptz' })
  publishDate: Date;

  @Column({
    name: 'min_buy',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  minBuy: number;

  @Column({
    name: 'max_buy',
    type: 'decimal',
    precision: 30,
    scale: 8,
    nullable: false,
  })
  maxBuy: number;

  @Column({ length: 255, nullable: false })
  slug: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'min_investor', default: 0 })
  minInvestor: number;

  @Column({ name: 'had_live', default: false })
  hadLive: boolean;

  @Column({ name: 'has_mint', default: false })
  hasMint: boolean;

  @Column({
    name: 'amount_invested',
    type: 'decimal',
    precision: 30,
    scale: 8,
    transformer: {
      to: (value: number) => value?.toFixed(8), // แปลง number -> string (decimal)
      from: (value: string) => parseFloat(value), // แปลง string -> number
    },
  })
  amountInvested: number;

  @Column({ name: 'job_id', nullable: true })
  jobId: string;

  @Column({ name: 'suspended_at', nullable: true, type: 'timestamptz' })
  suspendedAt: Date;

  // Relations with ProjectDate
  @OneToMany(() => ProjectDateEntity, (projectDate) => projectDate.project)
  projectDates: ProjectDateEntity[];

  // Relations with SocialMedia
  @OneToMany(() => SocialMediaEntity, (socialMedia) => socialMedia.project)
  socialMedias: SocialMediaEntity[];
}
