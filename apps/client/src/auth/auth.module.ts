import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CaptchaController } from './controllers/captcha.controller';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthHelper, AuthService, CustomRegisteredService } from './services';
import {
  ClientCaptchaService,
  ClientConfigService,
  NextNoCacheManager,
  WechatGHSDKClient,
} from '@tsai-platform/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_YAML_CONF_KEY } from './auth.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthJwtGuard } from './guards/auth.jwt.guard';
import { WechatAuthController } from './controllers/wechat-auth.controller';
import { WechatAuthorizeService } from './services/wechat-authorize.service';
import { HttpModule } from '@nestjs/axios';
import { Agent } from 'https';

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
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          timeout: config.get<number>('axios.httpTimeout', 5000),
          maxRedirects: config.get<number>('axios.maxRedirects', 5),
          httpsAgent: new Agent({ rejectUnauthorized: false }),
          httpAgent: new Agent({ rejectUnauthorized: false }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, CaptchaController, WechatAuthController],
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
    WechatGHSDKClient,
    WechatAuthorizeService,
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
