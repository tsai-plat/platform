import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_YAML_CONF_KEY } from './auth.constants';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { CaptchaController } from './controllers/captcha.controller';
import { CaptchaService } from '@tsai-platform/core';
import { AuthHelper } from './services/auth.helper';
import { AuthService } from './services/auth.service';
import { AuthJwtGuard } from './guards/auth.jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

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
          subject: config.get<string>(`${JWT_YAML_CONF_KEY}.sub`, 'ts-admin'),
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
    JwtStrategy,
    AuthHelper,
    CaptchaService,
    AuthService,
  ],
  exports: [],
})
export class AuthModule {}
