import { EcClient } from './ec.client';

describe('EC-client', () => {
  describe('create key pairs', () => {
    test('Test random key length', () => {
      const cli = EcClient.newInstance('ES384');

      const keypairs = cli.genPemKeyPairs();

      expect(Object.keys(keypairs).length).toBeGreaterThanOrEqual(2);
    });

    test('list current env curves list', () => {
      const list = EcClient.listCurves();

      globalThis.console.log(JSON.stringify(list, null, 2));
      expect(list?.length).toBeGreaterThan(3);
    });
  });
});
