import { LotoModuleRouteType } from '@tsai-platform/common';

export const TsaiAdminModuleRoutes: { [k: string]: LotoModuleRouteType } = {
  commRoute: {
    name: 'Common ',
    modulePath: 'comm',
    desc: '公共模块API',
  },
  authRoute: {
    name: 'Authentication',
    modulePath: 'auth',
    desc: '登录鉴权模块',
  },
};
