import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LotoHeadersType, UuidGenerator } from '@tsailab/common';
import { IUserSession, LotoHeaderEnum } from '@tsailab/core-types';
import * as requestIP from 'request-ip';

export const LotoHeaders = createParamDecorator(
  async (props: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    let reqid: string = request.headers[LotoHeaderEnum.X_Loto_Reqid] ?? '';
    if (!reqid?.length) {
      reqid = await UuidGenerator.genReqid(32);
    }

    const info: LotoHeadersType = {
      ip: requestIP.getClientIp(request) ?? '',
      uid: user?.id,
      username: user?.username ?? '',
      reqid,
      cliid: request.headers[LotoHeaderEnum.X_Loto_Key],
      session: user ? (user as unknown as IUserSession) : undefined,
      LotoHeaderKeyType: '',
      orgno: user?.orgno ?? '',
    };

    return info && props ? info[props as string] : info;
  },
);
