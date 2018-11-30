const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const { randomBytes } = require('crypto');

/*******************************************************************************
  function: getPrivKey
  explanaion: 개인키를 얻어내는 함수
  input : NULL
  output: bs58check로 인코딩된 private key
*******************************************************************************/

var getPrivKey = function() {
  let privKey;
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))
  privKey = bs58check.encode(privKey);            // bs58check 로 인코딩 해서 리턴
  return privKey;
}

/*******************************************************************************
  function: getPubKey
  explanaion: 전달된 개인키의 publickey를 반환하는 함수
  input : privatekey
  output: publickey
*******************************************************************************/

var getPubKey = function(privKey) {
  privKey = bs58check.decode(privKey);
  let pubKey = secp256k1.publicKeyCreate(privKey);
  pubKey = bs58check.encode(pubKey);               // bs58check로 인코딩 해서 리턴
  return pubKey;
}

exports.getPrivKey = getPrivKey;
exports.getPubKey = getPubKey;
