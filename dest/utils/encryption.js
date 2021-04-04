"use strict";
/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const browserify_aes_1 = tslib_1.__importDefault(require("browserify-aes"));
const randombytes_1 = tslib_1.__importDefault(require("randombytes"));
const util_1 = require("util");
const uuid = tslib_1.__importStar(require("uuid"));
const _1 = require(".");
async function decrypt(v3Keystore, password, nonStrict = false) {
    if (!util_1.isString(password)) {
        throw new Error('No password given.');
    }
    const json = !util_1.isString(v3Keystore) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);
    if (json.version !== 3) {
        throw new Error('Not a valid V3 wallet');
    }
    let derivedKey;
    if (json.crypto.kdf === 'scrypt') {
        const { n, r, p, dklen, salt } = json.crypto.kdfparams;
        derivedKey = await _1.scrypt(Buffer.from(password), Buffer.from(salt, 'hex'), n, r, p, dklen);
    }
    else if (json.crypto.kdf === 'pbkdf2') {
        const { prf, c, dklen, salt } = json.crypto.kdfparams;
        if (prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }
        derivedKey = await _1.pbkdf2(Buffer.from(password), Buffer.from(salt, 'hex'), c, dklen);
    }
    else {
        throw new Error('Unsupported key derivation scheme');
    }
    const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
    const mac = _1.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }
    const iv = Buffer.from(json.crypto.cipherparams.iv, 'hex');
    const aesKey = derivedKey.slice(0, 16);
    const decipher = browserify_aes_1.default.createDecipheriv(json.crypto.cipher, aesKey, iv);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
exports.decrypt = decrypt;
async function encrypt(privateKey, address, password, options = {}) {
    const cipherAlgo = options.cipher || 'aes-128-ctr';
    const salt = options.salt ? Buffer.from(options.salt, 'hex') : randombytes_1.default(32);
    const iv = options.iv ? Buffer.from(options.iv, 'hex') : randombytes_1.default(16);
    const kdf = options.kdf || 'scrypt';
    const id = options.id || uuid.v4({ random: options.uuid || randombytes_1.default(16) });
    if (cipherAlgo !== 'aes-128-ctr') {
        throw new Error('Unsupported cipher');
    }
    let derivedKey;
    let kdfparams;
    if (kdf === 'pbkdf2') {
        const { c = 262144, dklen = 32 } = options;
        derivedKey = await _1.pbkdf2(Buffer.from(password), salt, c, dklen);
        kdfparams = { c, dklen, prf: 'hmac-sha256', salt: salt.toString('hex') };
    }
    else if (kdf === 'scrypt') {
        const { n = 8192, r = 8, p = 1, dklen = 32 } = options;
        derivedKey = await _1.scrypt(Buffer.from(password), salt, n, r, p, dklen);
        kdfparams = { n, r, p, dklen, salt: salt.toString('hex') };
    }
    else {
        throw new Error('Unsupported kdf');
    }
    const aesKey = derivedKey.slice(0, 16);
    const cipher = browserify_aes_1.default.createCipheriv(cipherAlgo, aesKey, iv);
    if (!cipher) {
        throw new Error('Unsupported cipher');
    }
    const ciphertext = Buffer.concat([cipher.update(privateKey), cipher.final()]);
    const mac = _1.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
    return {
        version: 3,
        id,
        address: address
            .toString()
            .toLowerCase()
            .replace('0x', ''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex'),
            },
            cipher: 'aes-128-ctr',
            kdf,
            kdfparams,
            mac: mac.toString(),
        },
    };
}
exports.encrypt = encrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jcnlwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9lbmNyeXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7OztBQUVGLDRFQUFpQztBQUNqQyxzRUFBc0M7QUFDdEMsK0JBQWdDO0FBQ2hDLG1EQUE2QjtBQUM3Qix3QkFBeUM7QUFrQ2xDLEtBQUssVUFBVSxPQUFPLENBQzNCLFVBQTZCLEVBQzdCLFFBQWdCLEVBQ2hCLFlBQXFCLEtBQUs7SUFFMUIsSUFBSSxDQUFDLGVBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDdkM7SUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLGVBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVoSCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUMxQztJQUVELElBQUksVUFBVSxDQUFDO0lBRWYsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUV2RCxVQUFVLEdBQUcsTUFBTSxTQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMs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