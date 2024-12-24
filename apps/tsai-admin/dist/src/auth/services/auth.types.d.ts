export type JwtConfigSchmeaOptions = {
    version?: string;
    iss: string;
    sub: string;
    secretKey: string;
    expirein?: string | number;
};
export type AccessTokenBase = {
    version: string;
    iat: number;
    exp: number;
    iss: string;
    aud: string;
    sub: string;
};
export type AccessPayloadExtends = {
    platform: number;
    avatar?: string;
    nonce?: string;
};
export type OAuth20AccessPayload = AccessTokenBase & {
    jti: string;
    id: number;
    uno?: string;
    username: string;
    esim?: string;
};
