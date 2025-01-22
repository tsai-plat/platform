import { Injectable } from '@nestjs/common';
import { CosService } from '@tsai-platform/core';
import { LotoHeadersType } from '@tsailab/common';
import { UploadFormData } from '@tsailab/core-types';

@Injectable()
export class UploadService {
  constructor(private readonly cosService: CosService) {}

  async uploadAvatar(
    file: Express.Multer.File,
    formData: UploadFormData,
    headers: LotoHeadersType,
  ) {
    const resp = await this.cosService.uploadFile(file, formData, headers);

    return resp;
  }
}
