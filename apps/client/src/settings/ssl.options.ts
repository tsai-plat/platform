import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const loadSslOptions = () => {
  const certsBaseDir = join(process.cwd(), '.conf', 'certs');
  const privateKeyName = 'cert.key';
  const publicKeyName = 'cert.pem';
  if (!existsSync(join(certsBaseDir, privateKeyName))) {
    throw new Error(`Miss privateKeyName : ${privateKeyName}`);
  }
  if (!existsSync(join(certsBaseDir, publicKeyName))) {
    throw new Error(`Miss publicKeyName : ${publicKeyName}`);
  }

  return {
    key: readFileSync(join(certsBaseDir, privateKeyName)),
    cert: readFileSync(join(certsBaseDir, publicKeyName)),
  };
};

export default loadSslOptions;
