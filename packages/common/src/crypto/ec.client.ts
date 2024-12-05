import { createECDH, ECDH, getCurves } from 'crypto';
import * as ecKeyUtils from 'eckey-utils';
import { JwtAlgorithm } from '../types';

export const oidedToAnsi = {
  prime256v1: 'P-256',
  secp384r1: 'P-384',
  secp521r1: 'P-521',
};

export class EcClient {
  private ec: ECDH;
  private nameCurve: string = 'prime256v1';
  constructor(alg: JwtAlgorithm) {
    switch (alg) {
      case 'ES256':
        this.nameCurve = 'prime256v1';
        break;
      case 'ES384':
        this.nameCurve = 'secp384r1';
        break;
      case 'ES512':
        this.nameCurve = 'secp521r1';
        break;
      default:
        this.nameCurve = 'prime256v1';
        break;
    }

    this.ec = createECDH(this.nameCurve);
  }

  genPemKeyPairs() {
    this.ec.generateKeys();
    const pems = ecKeyUtils.generatePem({
      curveName: this.nameCurve,
      privateKey: this.ec.getPrivateKey(),
      publicKey: this.ec.getPublicKey(),
    });
    return {
      prikey: pems.privateKey,
      pubkey: pems.publicKey,
    };
  }

  static newInstance(alg?: JwtAlgorithm) {
    return new EcClient(alg);
  }
  static listCurves() {
    return getCurves();
  }
}
