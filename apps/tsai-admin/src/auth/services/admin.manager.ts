import { Injectable } from '@nestjs/common';
import { SysUserService } from '@tsailab/system';

@Injectable()
export class AdminManager {
  constructor(private readonly sysUserService: SysUserService) {}
}
