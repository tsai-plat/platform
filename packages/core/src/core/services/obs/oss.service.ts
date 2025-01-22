import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OssProvider, UploadFormType } from '@tsailab/core-types';
import { OBS_CONF_PREFIX } from './obs.constants';
import {
  AliObsSchema,
  BizException,
  ErrorCodeEnum,
  LotoHeadersType,
} from '@tsailab/common';

@Injectable()
export class OssService {
  private logger = new Logger(OssService.name);
  private serviceEnable;
  private readonly provider: OssProvider = 'ali';
  private readonly ossConfig: AliObsSchema;

  constructor(private readonly config: ConfigService) {
    const obs = this.config.get<string>(`${OBS_CONF_PREFIX}.provider`, 'any');
    this.serviceEnable = ['any', 'ali'].includes(obs);
    const cosConf = this.config.get<AliObsSchema>(
      `${OBS_CONF_PREFIX}.oss`,
      null,
    );
    if (
      !cosConf ||
      !cosConf?.appid ||
      !cosConf?.secretId ||
      !cosConf?.secretKey ||
      !cosConf?.bucket
    ) {
      this.serviceEnable = false;
      this.logger.error(`Loading the ${this.provider} OBS config fail.`);
    } else {
      let _duration = 7200;
      const {
        durationSeconds = '',
        appid,
        secretId,
        secretKey,
        region = 'ap-beijing',
        bucket,
        cdn = '',
      } = cosConf as any as AliObsSchema;

      if (/^[1-9]([\d\*]+)?$/.test(durationSeconds.toString())) {
        if (/[\d]+/.test(durationSeconds.toString())) {
          _duration = Number(durationSeconds);
        } else if (durationSeconds.toString().split('*').length > 1) {
          _duration = durationSeconds
            .toString()
            .split('*')
            .map((v) => Number(v))
            .reduce((ret, curr) => ret * curr, 1);
        }
      }

      this.ossConfig = {
        appid,
        secretId,
        secretKey,
        bucket,
        durationSeconds: _duration,
        region,
        cdn,
      };
    }
  }

  public checkConfig(): AliObsSchema {
    if (!this.serviceEnable || !this.ossConfig)
      throw BizException.ConfigurationError(`Ali oss service disabled`);

    return this.ossConfig;
  }

  /**
   *
   * @param file
   * @param formData
   * @param headers
   */
  async uploadFile(
    _file: Express.Multer.File,
    _formData: UploadFormType | undefined,
    _headers: LotoHeadersType,
  ) {
    throw BizException.createError(
      ErrorCodeEnum.SERVICE_UNAVAILABLE,
      `Ali OSS 服务暂不支持`,
    );
  }
}
