import * as bcrypt from 'bcrypt';
import { objectKeySorted } from '../utils/sortable';

const DEFAULT_ROUNDS = 10;
const DEFAULT_PW = 'Tsailab';
export class BcryptHelper {
  static async encryptPassword(
    password: string = DEFAULT_PW,
    rounds: number = DEFAULT_ROUNDS,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);
    const enpw = await bcrypt.hash(password, salt);
    return enpw;
  }

  /**
   * sortable json
   * @example
   * ```text
   *  uid: x
   *  json {b:2,a:1}
   *  `${uid}${JSON.stringify(sortable:json)}`
   *  stringify : x{\"a\":1,\"b\":2,\"uid\":\"x\"}
   * ```
   * @param uid
   * @param json
   * @returns hash string
   */
  static async keccak256(
    uid: number,
    json?: Record<string, any>,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(5);
    const merged: Record<string, any> = { ...(json ?? {}), uid };
    const sortedJson = objectKeySorted(merged);

    const text = `${uid}${JSON.stringify(sortedJson)}`;
    const hash = await bcrypt.hash(text, salt);
    return hash;
  }

  /**
   *
   * @param password
   * @param enpassword
   * @returns boolean
   */
  static async validPassword(
    password: string,
    enpassword: string = '',
  ): Promise<boolean> {
    if (!enpassword?.length && password === enpassword) return true;

    return await bcrypt.compare(password, enpassword);
  }
}
