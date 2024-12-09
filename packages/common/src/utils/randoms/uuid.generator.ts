import { customAlphabet } from 'nanoid/async';
const ASE58_ALPHABET_SEED =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const REQID_ALPHABET_SEED =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz-.$';

const BASE58_ALPHABET_SEED =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const APPKEY_DEFAULT_SEED =
  '$-.abcdefghjkmnpqrstuvwxyz123456789ABDCEFGHJKLMNPQRSTUVW_';

const APPKEY_HEX_SEED = '0123456789abcdefABCDEF';

export class UuidGenerator {
  static async genBase58Uuid(len: number = 32): Promise<string> {
    const _len = len > 0 ? len : 32;
    const nanoid = customAlphabet(ASE58_ALPHABET_SEED, _len);

    return await nanoid();
  }

  static genReqid(len: number = 32): Promise<string> {
    const _len = len > 0 ? len : 32;
    const nanoid = customAlphabet(REQID_ALPHABET_SEED, _len);
    return nanoid();
  }

  static async createJti(size: number = 20): Promise<string> {
    const nanoid = customAlphabet(ASE58_ALPHABET_SEED, size);
    return await nanoid();
  }

  static async generateAppSecret(opts?: {
    len?: number;
    mode?: 'hex' | 'base58' | 'default';
  }): Promise<string> {
    const { len = 16, mode = 'default' } = opts || {};
    let nanoid;

    switch (mode) {
      case 'base58':
        nanoid = customAlphabet(BASE58_ALPHABET_SEED, len);
        break;
      case 'hex':
        nanoid = customAlphabet(APPKEY_HEX_SEED, len);
        break;
      default:
        nanoid = customAlphabet(APPKEY_DEFAULT_SEED, len);
        break;
    }

    return await nanoid();
  }
}
