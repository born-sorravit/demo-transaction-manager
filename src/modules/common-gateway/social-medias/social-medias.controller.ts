import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SocialMediasService } from './social-medias.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';

@Controller('social-medias')
export class SocialMediasController {
  constructor(private readonly socialMediasService: SocialMediasService) {}

  @Post()
  create(@Body() createSocialMediaDto: CreateSocialMediaDto) {
    return this.socialMediasService.create(createSocialMediaDto);
  }

  @Get()
  findAll() {
    return this.socialMediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialMediasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
  ) {
    return this.socialMediasService.update(+id, updateSocialMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialMediasService.remove(+id);
  }
}
