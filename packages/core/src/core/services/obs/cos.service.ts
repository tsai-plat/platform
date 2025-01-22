import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  BizException,
  CacheKeyHelper,
  ErrorCodeEnum,
  LotoHeadersType,
  TecentObsSchema,
} from '@tsailab/common';
import { MQLogPayload } from '@tsailab/core-types';
import {
  AttchmentFileStateEnum,
  AttchmentFiletype,
  OssProvider,
  UploadFormType,
} from '@tsailab/core-types';
import { RedisMQService } from '@tsailab/ioredis-mq';

import * as COS from 'cos-nodejs-sdk-v5';
import {
  CosPolicyScope,
  CredentialData,
  getCredential,
  getPolicy,
} from 'qcloud-cos-sts';
import { MQChannelEnum } from '../../../enums';
import { OBS_CONF_PREFIX } from './obs.constants';
import { AttachmentService } from './attchment.service';
import { AttachmentEntity } from '../../../entities';

@Injectable()
export class CosService {
  private logger = new Logger(CosService.name);
  private serviceEnable;
  private cosConfig: TecentObsSchema;
  private readonly provider: OssProvider = 'tecent';

  private defaultScopeActions: string[] = [
    'name/cos:PutObject',
    'name/cos:PostObject',
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload',
  ];

  constructor(
    private readonly config: ConfigService,
    private readonly mq: RedisMQService,
    private readonly attactmentSevice: AttachmentService,
  ) {
    const obs = this.config.get<string>(`${OBS_CONF_PREFIX}.provider`, 'any');
    this.serviceEnable = ['any', 'tecent'].includes(obs);
    const cosConf = this.config.get<TecentObsSchema>(
      `${OBS_CONF_PREFIX}.cos`,
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
      this.logger.error(`Loading the tecent OBS config fail.`);
    } else {
      let _duration = 7200;
      const {
        durationSeconds = '',
        appid,
        secretId,
        secretKey,
        region = 'ap-beijing',
        bucket,
        endpoint = 'sts.tencentcloudapi.com',
        cdn = '',
        allowPrefix,
        followRedirect = false,
        storageClass = 'STANDARD',
      } = cosConf as any as TecentObsSchema;

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

      this.cosConfig = {
        appid,
        secretId,
        secretKey,
        bucket,
        durationSeconds: _duration,
        region,
        endpoint,
        cdn,
        allowPrefix,
        followRedirect,
        storageClass,
      };
    }
  }

  getConfig() {
    if (!this.serviceEnable || !this.cosConfig)
      throw BizException.ConfigurationError(`tencent cos service disabled`);
    return this.cosConfig;
  }

  /**
   *
   * @param file
   * @param formData
   * @param headers
   */
  async uploadFile(
    file: Express.Multer.File,
    formData: UploadFormType | undefined,
    headers: LotoHeadersType,
  ) {
    const launchTime = Date.now();
    const { username, uno } = headers;
    const mqpayload: MQLogPayload = {
      bizcode: `comm-upload-cos`,
      action: `${CosService.name}:uploadFile`,
      result: '',
      launchTime,
      options: {
        ...headers,
      },
      operator: username,
      locked: true,
    };
    try {
      const size = file.size;
      const originname = file.originalname;
      const { bucket, region, storageClass } = this.getConfig();
      const saveFileName = this.buildCosFileName(
        file.fieldname,
        formData?.type,
      );
      mqpayload.reqdata = {
        ...formData,
        uno,
        originname,
        filesize: size,
        saveFileName,
      };

      const cos = this.createCosInstance();
      const resp = await cos.putObject({
        Bucket: bucket,
        Region: region,
        StorageClass: storageClass ?? 'STANDARD',
        Body: file.stream,
        Key: saveFileName,
      });

      const { url, pathname, filename } = await this.attactmentSevice.create(
        this.buildSaveCosEntity(resp, saveFileName, {
          filename: file.filename,
          filesize: size,
          headers,
          state: AttchmentFileStateEnum.ONLY_OSS_FILE,
        }),
      );

      mqpayload.reqdata = {
        url,
        pathname,
        filename,
      };
      mqpayload.result = '上传成功';

      await this.mq.publishMessage(mqpayload, MQChannelEnum.uploadLog);
    } catch (ex: any) {
      this.logger.error(ex);
      mqpayload.result = ex?.message ?? '上传失败';
      mqpayload.error = `${JSON.stringify(ex)}`.slice(0, 2000);
      await this.mq.publishMessage(mqpayload, MQChannelEnum.uploadLog);
      throw ex;
    }
  }

  private buildCosFileName(filename: string, type?: AttchmentFiletype): string {
    if (!type?.toString()?.length) return filename;
    return type?.toString().endsWith('/')
      ? `${type}${filename}`
      : `${type}/${filename}`;
  }

  /**
   *
   * @param allow
   * @returns CredentialData
   */
  private async getTempCredential(
    actions: string | string[] = this.defaultScopeActions,
    allow?: string,
  ): Promise<CredentialData> {
    const {
      secretId,
      secretKey,
      bucket,
      durationSeconds,
      region,
      allowPrefix,
    } = this.getConfig();

    try {
      const scopes: CosPolicyScope[] = [
        {
          action: actions,
          bucket,
          region,
          prefix: allow ?? allowPrefix,
        },
      ];
      const policy = getPolicy(scopes);
      const resp = await getCredential({
        secretId,
        secretKey,
        durationSeconds: durationSeconds
          ? (durationSeconds as number)
          : undefined,
        policy,
      });
      return resp;
    } catch (ex: any) {
      this.logger.error(ex);
      throw BizException.createError(
        ErrorCodeEnum.VENDOR_SERVICE_ERROR,
        `腾讯COS获取临时授权失败:${ex?.message}`,
      );
    }
  }

  private createCosInstance() {
    const { secretId, secretKey } = this.getConfig();
    return new COS({
      SecretId: secretId,
      SecretKey: secretKey,
    });
  }

  private buildCacheCredentialKey(bucket: string): string {
    return CacheKeyHelper.buildVendorTokenKey('tecent', 'cos', bucket);
  }

  private buildSaveCosEntity(
    result: COS.PutObjectResult,
    pathname: string,
    options: {
      formData?: UploadFormType;
      headers: LotoHeadersType;
      filename: string;
      filesize: number;
      state: AttchmentFileStateEnum;
      locked?: boolean;
    },
  ): Partial<AttachmentEntity> {
    const { ETag, Location, VersionId } = result;
    const {
      formData = {},
      headers,
      filesize,
      filename,
      state,
      locked,
    } = options;
    const { type, refid, reftb } = formData;
    const { username, uno, reqid, orgno } = headers;

    const extraJson: Record<string, any> = {
      ETag,
      Location,
      VersionId,
      filesize,
      reqid,
    };
    const { cdn } = this.getConfig();
    let url;
    if (cdn) {
      url = cdn?.endsWith('/') ? cdn + pathname : `${cdn}/${pathname}`;
    }
    const entity: Partial<AttachmentEntity> = {
      osstype: this.provider,
      filetype: type,
      filename,
      pathname,
      url,
      refid,
      reftb,
      user: username ?? uno,
      ossid: ETag,
      orgno,
      state,
      locked,
      extra: JSON.stringify(extraJson),
    };

    return entity;
  }
}
