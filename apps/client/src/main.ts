import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LotoAppListener } from '@tsailab/common';
import * as chalk from 'chalk';
import { isDevMode } from './settings';
import loadSslOptions from './settings/ssl.options';
import helmet from 'helmet';
import { RequestMethod } from '@nestjs/common';
import { convertYes } from '@tsailab/core-types';

import { version, author, name, description } from '../package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const listeners: Array<LotoAppListener> = [];

  const httpsOptions = isDevMode ? loadSslOptions() : undefined;
  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions,
  });

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.server.port', 18945);
  const apiPrefix = configService.get<string>('app.prefix', 'v1');

  //允许跨域请求
  app.enableCors({
    credentials: true,
    origin: true,
  });
  // Web漏洞的
  app.use(helmet());

  await app.setGlobalPrefix(apiPrefix, {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.GET,
      },
    ],
  });

  // Document
  const swaggerEnabled = configService.get<string | number | boolean>(
    'swagger.enabled',
    'off',
  );
  const docTitle = configService.get<string>('app.name', name);
  if (convertYes(swaggerEnabled)) {
    const docDesc = configService.get<string>('swagger.docDesc', description);
    const wikiUrl = configService.get<string>(
      'swagger.wiki',
      'https://github.com/tsai-plat/tsai-cli#readme',
    );

    const options = new DocumentBuilder()
      .setBasePath(`/${apiPrefix}/`)
      .setTitle(docTitle)
      .setDescription(docDesc)
      .addBearerAuth()
      .addTag(`api-${apiPrefix}`)
      .setVersion(version ?? '1.0.0')
      .setContact(author ?? 'tsai', wikiUrl, 'lamborcai@gmail.com')
      .build();

    const document = await SwaggerModule.createDocument(app, options);
    await SwaggerModule.setup(`docs-${apiPrefix}`, app, document);
  }

  // listen on
  await app.listen(appPort, '0.0.0.0');
  const serveUrl = await app.getUrl();

  if (convertYes(swaggerEnabled)) {
    listeners.push({
      name: `${docTitle} API`,
      url: `${serveUrl}/docs-${apiPrefix}`,
    });
  }

  listeners.push({
    name: 'Api Home',
    url: `${serveUrl}/health`,
  });

  return listeners.reverse();
}

bootstrap()
  .then((listeners) => {
    const logger = console.log;

    logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
    logger(chalk.magentaBright(`乐通API启动完成...\n`));

    listeners.forEach(({ name, url }) => {
      logger(chalk.cyan(`${name}: `, url));
    });

    logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
  })
  .catch((error: any) => {
    console.error(error);
  });
