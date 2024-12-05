import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'crypto';
import { AESOptionsType } from '../types';

export const AES_KEY_LENGTH = 32;

export const AES_ALGORITHM_CBC = 'aes-256-cbc';

/**
 *
 * @returns
 */
export function genRandomAppKey(): string {
  const base64Key = randomBytes(AES_KEY_LENGTH).toString('base64');
  return base64Key;
}

export class AESCipher {
  protected alg = 'aes-256-cbc';
  private readonly key;
  private readonly iv;

  constructor(appKey: string) {
    const { key, iv } = AESCipher.parseAppKey(appKey);

    this.key = key;
    this.iv = iv;
  }

  get opts(): AESOptionsType {
    return {
      alg: this.alg,
      key: this.key?.toString('base64'),
      iv: this.iv?.toString('base64'),
    } as AESOptionsType;
  }

  get hexOpts(): AESOptionsType {
    return {
      alg: this.alg,
      key: this.key?.toString('hex'),
      iv: this.iv?.toString('hex'),
    };
  }

  /**
   *
   * @param text
   * @returns string
   */
  encode(text: string): string {
    const cipher = createCipheriv(this.alg, this.key, this.iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return encrypted;
  }

  /**
   * utf8
   * @param encryptedData hex
   * @returns string utf8
   */
  decode(encryptedData): string {
    const decipher = createDecipheriv(this.alg, this.key, this.iv);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static parseAppKey(appKey: string) {
    const keybuf = createHash('sha512').update(appKey).digest();

    globalThis.console.log(
      keybuf.toString('hex'),
      keybuf.subarray(0, 32).toString('hex'),
    );
    return {
      key: keybuf.subarray(0, 32),
      iv: keybuf.subarray(0, 16),
    };
  }

  static fromBase64(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
  }

  static fromBase64ToHex(base64: string): string {
    return Buffer.from(base64, 'base64').toString('hex');
  }

  static hexToBase64(hex: string): string {
    return Buffer.from(hex, 'hex').toString('base64');
  }

  static newInstance(appKey: string) {
    return new AESCipher(appKey);
  }
}
