import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LotoHeadersType } from '@tsai-platform/common';
import * as requestIP from 'request-ip';

export const LotoHeaders = createParamDecorator(
  async (props: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    let info: LotoHeadersType | undefined;

    const headerInfo: LotoHeadersType = {
      ip: requestIP.getClientIp(request),
    };

    return info && props ? info[props as string] : info;
  },
);
