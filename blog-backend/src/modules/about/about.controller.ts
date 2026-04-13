import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: '获取关于页面' })
  find() {
    return this.aboutService.find();
  }

  @Put()
  @ApiOperation({ summary: '更新关于页面' })
  update(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.update(updateAboutDto);
  }
}
