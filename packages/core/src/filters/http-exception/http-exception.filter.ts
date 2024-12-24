import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { BizException, ValidationException } from '@tsailab/common';
import * as requestIP from 'request-ip';

const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

const CONTENT_TYPE_HEADER = 'application/json; charset=utf-8';

@Catch(HttpException, BadRequestException, UnauthorizedException, BizException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();

    const response = ctx.getResponse();

    const status = getStatusCode(exception);

    if (exception || status) {
      this.log(ctx, exception);
    }

    if (exception instanceof BizException) {
      const bizerr = exception as BizException;

      const data = {
        code: bizerr.code,
        message: bizerr.message,
        error: bizerr.error,
      };

      response.status(HttpStatus.OK);
      response.header('Content-type', CONTENT_TYPE_HEADER);
      response.send(data);
    } else if (exception instanceof UnauthorizedException) {
      const message = (exception as UnauthorizedException).message;
      response.header('Content-type', CONTENT_TYPE_HEADER);
      response.status(status);
      response.send({
        code: status,
        message: message,
      });
    } else if (exception instanceof ValidationException) {
      const validEx = exception as ValidationException;

      const res = validEx.getResponse();
      response.header('Content-type', CONTENT_TYPE_HEADER);
      response.status(HttpStatus.BAD_REQUEST);
      response.send(res);
    } else {
      const statusCode =
        status || response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
      response.header('Content-type', CONTENT_TYPE_HEADER);
      response.send({
        code: statusCode,
        message: (exception as Error).message,
      });
    }
  }

  private log(ctx: HttpArgumentsHost, exception: T) {
    const { user, ip, originalUrl } = ctx.getRequest();

    let url = originalUrl as string;
    url = url?.indexOf('?') > 0 ? url.substring(0, url.indexOf('?')) : url;

    const realIp = requestIP.getClientIp(ctx.getRequest()) ?? ip;
    this.logger.warn(
      `${user?.username} [IP: ${realIp}] visit [${url}] Exception.`,
      exception,
    );
  }
}
