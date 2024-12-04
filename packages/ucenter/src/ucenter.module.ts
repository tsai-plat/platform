import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from './services/user-service';
import { UCenterModuleOptions } from './types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';

@Module({})
export class UcenterModule {
  static async forRoot(
    options: UCenterModuleOptions = {
      debug: false,
    },
  ): Promise<DynamicModule> {
    return {
      module: UcenterModule,
      global: options.isGlobal,
      imports: [TypeOrmModule.forFeature([UserEntity])],
      providers: [UserService],
      exports: [UserService],
    };
  }
}
