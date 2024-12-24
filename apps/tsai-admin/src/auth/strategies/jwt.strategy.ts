import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_YAML_CONF_KEY, SYSTEM_TOKEN_HEADER } from '../auth.constants';
import { IUser, JwtAccessPayload } from '@tsailab/common';
import { AuthHelper } from '../services/auth.helper';

/**
 * jwt strategy for validate jwt token
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  protected logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly config: ConfigService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(SYSTEM_TOKEN_HEADER),
      ignoreExpiration: true,
      secretOrKey: config.get<string>(`${JWT_YAML_CONF_KEY}.secretKey`, null),
    });
  }

  /**
   *
   * @param payload
   * @returns IUser or null
   */
  async validate(payload: JwtAccessPayload) {
    const { id, clit, acctype } = payload;
    const cache = await this.authHelper.checkTokenExists(id, clit, acctype);

    if (!cache) return null;
    const { token: _, ...user } = cache;
    return { ...user } as IUser;
  }
}
