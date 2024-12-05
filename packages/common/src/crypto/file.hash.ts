import { createHash, Encoding } from 'crypto';

/**
 *
 * @param content
 * @param opts
 * @returns hash string
 */
export function calcHash(
  content: string = '',
  opts: {
    encoding?: Encoding;
    alg?: string;
  } = {
    encoding: 'utf8',
    alg: 'sha256',
  },
): string {
  const { encoding, alg } = opts;
  return createHash(alg).update(content, encoding).digest('hex');
}
