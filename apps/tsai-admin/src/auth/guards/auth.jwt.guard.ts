import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { PublicApiPropertyName } from '@tsai-platform/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
/**
 * @see nestjs-passport
 *  register(options)
 *  options:
 *    defaultStrategy: jwt local twitter etd.
 *    session: true
 *    property: user
 *  @see more http://passportjs.org
 *    options:
 *      - `successRedirect`  After successful login, redirect to given URL
 *      - `successMessage`   True to store success message in
 *                        req.session.messages, or a string to use as override
 *                        message for success.
 *      - `successFlash`     True to flash success messages or a string to use as a flash
 *                        message for success (overrides any from the strategy itself).
 *      - `failureRedirect`  After failed login, redirect to given URL
 *      - `failureMessage`   True to store failure message in
 *                        req.session.messages, or a string to use as override
 *                        message for failure.
 *      - `failureFlash`     True to flash failure messages or a string to use as a flash
 *                        message for failures (overrides any from the strategy itself).
 *      - `assignProperty`   Assign the object provided by the verify callback to given property
 *
 */
@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') implements IAuthGuard {
  protected logger = new Logger(AuthJwtGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly config: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // if (this.config.get<string>('STAGE', 'prod') === 'dev') return true;
    // release public routes
    const isPublic = this.reflector.getAllAndOverride(PublicApiPropertyName, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // const token = this.extractTokenFromHeader(
    //   context.switchToHttp().getRequest(),
    // );
    // this.logger.log('>>>>>Jwt token>>>>>>', token);

    return super.canActivate(context);
  }

  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
