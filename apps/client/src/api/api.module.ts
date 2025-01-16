import { Module } from '@nestjs/common';
import { CustomModule } from './custom/custom.module';

@Module({
  imports: [CustomModule],
})
export class ApiModule {}
