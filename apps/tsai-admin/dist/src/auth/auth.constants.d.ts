import { JwtConfigSchmeaOptions } from './services/auth.types';
export declare const JWT_YAML_CONF_KEY = "auth.jwt";
export declare const defaultJwtOpts: Omit<JwtConfigSchmeaOptions, 'secretKey'>;
