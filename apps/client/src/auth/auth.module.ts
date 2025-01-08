import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CaptchaController } from './controllers/captcha.controller';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthHelper, AuthService, CustomRegisteredService } from './services';
import {
  ClientCaptchaService,
  ClientConfigService,
  NextNoCacheManager,
} from '@tsai-platform/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_YAML_CONF_KEY } from './auth.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthJwtGuard } from './guards/auth.jwt.guard';

@Global()
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(`${JWT_YAML_CONF_KEY}.secretKey`),
        signOptions: {
          issuer: config.get<string>(`${JWT_YAML_CONF_KEY}.iss`, 'tsailab'),
          subject: config.get<string>(`${JWT_YAML_CONF_KEY}.sub`, 'ts-client'),
          // audience: config.get<string>(`${JWT_YAML_CONF_KEY}.sub`, 'admin-ui'),
        },
        verifyOptions: {
          ignoreExpiration: true, // use redis manage token expire
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, CaptchaController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
    ClientConfigService,
    CustomRegisteredService,
    AuthHelper,
    AuthService,
    JwtStrategy,
    ClientCaptchaService,
    // {
    //   provide: 'JWT_STRATEGY',
    //   useFactory: (config: ConfigService, auth: AuthHelper) => {
    //     return new JwtStrategy(config, auth);
    //   },
    //   inject: [ConfigService, AuthHelper],
    // },
    NextNoCacheManager,
  ],
  exports: [
    ClientCaptchaService,
    ClientConfigService,
    CustomRegisteredService,
    AuthHelper,
    AuthService,
  ],
})
export class AuthModule {}
