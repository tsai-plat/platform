"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const loadSslOptions = () => {
    const certsBaseDir = (0, path_1.join)(process.cwd(), '.conf', 'certs');
    const privateKeyName = 'cert.key';
    const publicKeyName = 'cert.pem';
    if (!(0, fs_1.existsSync)((0, path_1.join)(certsBaseDir, privateKeyName))) {
        throw new Error(`Miss privateKeyName : ${privateKeyName}`);
    }
    if (!(0, fs_1.existsSync)((0, path_1.join)(certsBaseDir, publicKeyName))) {
        throw new Error(`Miss publicKeyName : ${publicKeyName}`);
    }
    return {
        key: (0, fs_1.readFileSync)((0, path_1.join)(certsBaseDir, privateKeyName)),
        cert: (0, fs_1.readFileSync)((0, path_1.join)(certsBaseDir, publicKeyName)),
    };
};
exports.default = loadSslOptions;
//# sourceMappingURL=ssl.options.helper.js.map