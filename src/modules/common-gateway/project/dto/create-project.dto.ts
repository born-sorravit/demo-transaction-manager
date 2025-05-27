import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IProjectDate } from 'src/interfaces/project-dates/project-dates.interface';
import { ISocialMedias } from 'src/interfaces/social-medias/social-medias.interface';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsNotEmpty()
  softCap: number;

  @IsNumber({
    allowNaN: false,
  })
  @IsNotEmpty()
  hardCap?: number;

  @IsString()
  @IsNotEmpty()
  chainId: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsOptional()
  @Min(0)
  apy: number;

  @IsNumber({
    allowNaN: false,
  })
  @IsPositive() // Checks if the value is a positive number greater than zero.
  @IsNotEmpty()
  pricePerToken: number;

  @IsNumber({
    allowNaN: false,
  })
  @IsPositive() // Checks if the value is a positive number greater than zero.
  @IsNotEmpty()
  totalSupply: number;

  @IsString()
  @IsNotEmpty()
  whitePaperUrl: string;

  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value as string), { toClassOnly: true })
  publishDate: Date;

  @IsNumber({
    allowNaN: false,
  })
  @IsPositive() // Checks if the value is a positive number greater than zero.
  @IsNotEmpty()
  minBuy: number;

  @IsNumber({
    allowNaN: false,
  })
  @IsPositive() // Checks if the value is a positive number greater than zero.
  @IsNotEmpty()
  maxBuy: number;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsNotEmpty()
  minInvestor: number;

  @IsArray()
  @ArrayMinSize(1)
  socialMedias: ISocialMedias[];

  @IsArray()
  @ArrayMinSize(3)
  projectDates: IProjectDate[];
}
