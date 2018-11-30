const keygen = require('../pki/keygen');
const sign = require('../pki/sign.js');

const secp256k1 = require('secp256k1');
const sha256 = require('sha256');
const bs58check = require('bs58check');
const { randomBytes } = require('crypto');

let signTransaction = sign.signTransaction;
let privatekey = keygen.getPrivKey();
let publickey = keygen.getPubKey(privatekey);

let tr = {
  "txid": 0,
  "vin": 2
}
tr["txid"] = sha256(JSON.stringify(tr));

privatekey = bs58check.decode(privatekey);
let sig = signTransaction(tr,privatekey);
publickey = bs58check.decode(publickey);
let result = secp256k1.verify(Buffer.from(tr["txid"].slice(0,32)), sig, publickey);

console.log(result);
