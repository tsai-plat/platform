import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { LotoHeaders } from '@tsai-platform/core';
import { AttchmentFiletypeEnum, UploadFormData } from '@tsailab/core-types';
import { LotoHeadersType } from '@tsailab/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '头像上传' })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Post('avatar')
  avatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() formData: UploadFormData,
    @LotoHeaders() headers: LotoHeadersType,
  ) {
    return this.uploadService.uploadAvatar(
      file,
      { ...formData, type: AttchmentFiletypeEnum.AVATAR },
      headers,
    );
  }
}
