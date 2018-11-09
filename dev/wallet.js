const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const ripemd160 = require('ripemd160');
const sha256 = require('sha256');

function getPrivKey() {
  let privKey;
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))
  privKey = bs58check(privKey);            // bs58check 로 인코딩 해서 리턴
  return privKey;
}

function getPubKey(privKey) {
  let pubKey = secp256k1.publicKeyCreate(privKey);
  pubKey = bs58check(pubKey);               // bs58check로 인코딩 해서 리턴
  return pubKey;
}

function getWalletAddress(pubKey){
  let pubkeyhash = ripemd160(sha256(pubKey));
  let address = bs58check(pubkeyhash);
  return address;
}
