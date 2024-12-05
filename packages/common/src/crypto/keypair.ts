import { createJsonWebKeyEC256 } from '@ingestkorea/util-jsonwebtoken';
import { generateKeyPairSync } from 'crypto';

/**
 * JWT
 * https://docs.topperpay.com/widgets/
 * @see https://notes.salrahman.com/generate-es256-es384-es512-private-keys/
 * Algorithm	Curve
 * ES256	prime256v1
 * ES384	secp384r1
 * ES512	secp521r1
 */
export function generateES256Keypairs(passphrase: string) {
  const res = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase,
    },
  });

  return res;
}

export function generateKeyPairs() {
  createJsonWebKeyEC256();
}
