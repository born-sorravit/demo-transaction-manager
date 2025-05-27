import { Injectable } from '@nestjs/common';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';

@Injectable()
export class SocialMediasService {
  create(createSocialMediaDto: CreateSocialMediaDto) {
    return 'This action adds a new socialMedia';
  }

  findAll() {
    return `This action returns all socialMedias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socialMedia`;
  }

  update(id: number, updateSocialMediaDto: UpdateSocialMediaDto) {
    return `This action updates a #${id} socialMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} socialMedia`;
  }
}
