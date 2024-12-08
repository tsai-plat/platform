"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@tsai-platform/common/");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const swagger_1 = require("@nestjs/swagger");
const package_json_1 = require("../package.json");
const common_2 = require("@nestjs/common");
const chalk = require("chalk");
const core_2 = require("@tsai-platform/core");
async function bootstrap() {
    const listeners = [];
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const appPort = configService.get('app.server.port', 38964);
    const apiPrefix = configService.get('app.prefix', 'v1');
    const swaggerEnabled = configService.get('swagger.enabled', 'off');
    const docTitle = configService.get('app.name', package_json_1.name);
    app.enableCors();
    app.use((0, helmet_1.default)());
    if ((0, common_1.convertYes)(swaggerEnabled)) {
        const docDesc = configService.get('swagger.docDesc', package_json_1.description);
        const wikiUrl = configService.get('swagger.wiki', 'https://github.com/tsai-plat/tsai-cli#readme');
        const options = new swagger_1.DocumentBuilder()
            .setTitle(docTitle)
            .setDescription(docDesc)
            .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
            .addTag(`api-${apiPrefix}`)
            .setVersion(package_json_1.version ?? '1.0.0')
            .setContact(package_json_1.author ?? 'tsai', wikiUrl, 'lamborcai@gmail.com')
            .build();
        const document = await swagger_1.SwaggerModule.createDocument(app, options);
        await swagger_1.SwaggerModule.setup(`docs-${apiPrefix}`, app, document);
    }
    await app.setGlobalPrefix(apiPrefix, {
        exclude: [
            {
                path: 'health',
                method: common_2.RequestMethod.GET,
            },
        ],
    });
    app.useGlobalPipes(new common_2.ValidationPipe({
        transform: true,
        exceptionFactory: core_2.validationExceptionFactory,
    }));
    app.useGlobalFilters(new core_2.HttpExceptionFilter());
    await app.listen(appPort, '0.0.0.0');
    const serveUrl = await app.getUrl();
    if ((0, common_1.convertYes)(swaggerEnabled)) {
        listeners.push({
            name: `${docTitle} API`,
            url: `${serveUrl}/docs-${apiPrefix}`,
        });
    }
    listeners.push({
        name: 'AppHome',
        url: `${serveUrl}/health`,
    });
    return listeners.reverse();
}
bootstrap()
    .then((listeners) => {
    const logger = console.log;
    logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
    logger(chalk.magentaBright(`乐通系统启动完成...\n`));
    listeners.forEach(({ name, url }) => {
        logger(chalk.cyan(`${name}: `, url));
    });
    logger(chalk.magentaBright('🌸🌸🌸🚀🚀🚀🌸🌸🌸'));
})
    .catch((error) => {
    console.error(error);
});
//# sourceMappingURL=main.js.map