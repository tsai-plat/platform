import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthHelper } from '../services';
import { JWT_YAML_CONF_KEY } from '../auth.constants';
import { IUser, JwtAccessPayload } from '@tsailab/core-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  protected logger = new Logger(JwtStrategy.name);

  private readonly singleton;
  constructor(
    private readonly config: ConfigService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get<string>(`${JWT_YAML_CONF_KEY}.secretKey`, null),
    });

    this.singleton = config.get<boolean>(
      `${JWT_YAML_CONF_KEY}.singleton`,
      false,
    );
  }

  /**
   *
   * @param payload
   * @returns IUser or null
   */
  async validate(payload: JwtAccessPayload, done: VerifiedCallback) {
    const { id, clit, acctype, jti } = payload;
    const cache = await this.authHelper.revalidateToken(id, clit, acctype);

    if (!cache) return done(new UnauthorizedException(`登录已失效!`), null);
    const { token, ...user } = cache;

    if (this.singleton) {
      const dePayload = await this.authHelper.decryptToken(token);

      if (dePayload?.jti !== jti)
        return done(new UnauthorizedException(`当前账号已在其他客户端登录!`));
    }

    return done(null, { ...user } as IUser);
  }
}
