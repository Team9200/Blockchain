const secp256k1 = require('secp256k1')
const bs58check = require('bs58check');

function signTransaction(transaction, address) {
  let pubKey = bs58check.decode(address);
  let msg = Buffer.from(transaction[tx_id].slice(0,32));
  let sign = secp256k1.sign(msg,privKeyBuffer);
  return sign.signature;
}

function verifySign(msg, signature, pubKey) {
  return secp256k1.verify(msg, signature, pubKey);
}
