import { LotoModuleRouteType } from '@tsailab/common';

export const TsaiAdminModuleRoutes: { [k: string]: LotoModuleRouteType } = {
  chatRoute: {
    name: 'Chatbot',
    modulePath: 'chat',
    desc: '对话机器人模块',
  },
  commRoute: {
    name: 'Common',
    modulePath: 'comm',
    desc: '公共模块API',
  },
  systemRoute: {
    name: 'System',
    modulePath: 'sys',
    desc: '系统模块API',
  },
  authRoute: {
    name: 'Authentication',
    modulePath: 'auth',
    desc: '登录鉴权模块',
  },
};
