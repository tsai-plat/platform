import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { convertYes, LotoAppListener } from '@tsai-platform/common/'
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version, author, name, description } from '../package.json';
import { RequestMethod } from '@nestjs/common';
import * as chalk from 'chalk';

/**
 * Tsailab Application bootstrap
 */
async function bootstrap() {
  const listeners:Array<LotoAppListener> = []
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appPort = configService.get<number>('app.server.port',38964)
  const apiPrefix = configService.get<string>('app.prefix','v1')
  const swaggerEnabled = configService.get<string|number|boolean>('swagger.enabled','off')
  const docTitle = configService.get<string>('app.name',name)

  //允许跨域请求
  app.enableCors();
  // Web漏洞的
  app.use(helmet());

  // 
  if(convertYes(swaggerEnabled)){
    const docDesc = configService.get<string>('swagger.docDesc', description);
    const wikiUrl = configService.get<string>(
      'swagger.wiki',
      'https://github.com/tsai-plat/tsai-cli#readme',
    );
   

    const options = new DocumentBuilder()
    .setTitle(docTitle)
    .setDescription(docDesc)
    .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
    .addTag(`api-${apiPrefix}`)
    .setVersion(version ?? '1.0.0')
    .setContact(author ?? 'tsai', wikiUrl, 'lamborcai@gmail.com')
    .build();

    const document = await SwaggerModule.createDocument(app, options);
    await SwaggerModule.setup(`docs-${apiPrefix}`, app, document);
  }


  await app.setGlobalPrefix(apiPrefix,{
    exclude:[
      {
        path:'health',
        method:RequestMethod.GET
      }
    ]
  })

  await app.listen(appPort,'0.0.0.0');

  const serveUrl = await app.getUrl()

  if(convertYes(swaggerEnabled)){
    listeners.push({
      name:`${docTitle} API`,
      url:`${serveUrl}/docs-${apiPrefix}`
    })
  }

  listeners.push({
    name: 'AppHome',
    url: `${serveUrl}/health`,
  });


  return listeners.reverse()
}


bootstrap().then((listeners)=>{
  const logger = console.log;

  logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
  logger(chalk.magentaBright(`乐通系统启动完成...\n`));

  listeners.forEach(({ name, url }) => {
    logger(chalk.cyan(`${name}: `, url));
  });

  logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
}).catch((error:any)=>{
  console.error(error);
});
