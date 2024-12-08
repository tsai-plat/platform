import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IgnoreTransformPropertyName } from '../decorators';
import { APIHttpStatus, APIResponse } from '@tsai-platform/common';

@Injectable()
export class ApiTransformInterceptor implements NestInterceptor {
  protected logger = new Logger(ApiTransformInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const {} = context.switchToHttp().getRequest();

    const ignored = context.getHandler()[IgnoreTransformPropertyName];

    return ignored
      ? next.handle()
      : next.handle().pipe(
          map((data: any): APIResponse<any> => {
            return {
              code: APIHttpStatus.OK,
              message: 'Success',
              result: data,
            };
          }),
        );
  }
}
