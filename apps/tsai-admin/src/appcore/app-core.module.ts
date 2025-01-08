import { Global, Module } from '@nestjs/common';
import { NextNoCacheManager } from '@tsai-platform/core';

@Global()
@Module({
  imports: [],
  providers: [NextNoCacheManager],
  exports: [NextNoCacheManager],
})
export class AppCoreModule {}
