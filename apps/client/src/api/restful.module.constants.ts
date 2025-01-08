interface ModuleRestfulInfo {
  name: string;
  basepath: string;
  description?: string;
}

export const CliRestfulAPIModules: Record<string, ModuleRestfulInfo> = {
  authorization: {
    name: '权限',
    basepath: '',
    description: '通用客户端用户注册、登录相关API',
  },
};
