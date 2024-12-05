import { customAlphabet } from 'nanoid/async';
const ASE58_ALPHABET_SEED =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const REQID_ALPHABET_SEED =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz-.$';

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
}
