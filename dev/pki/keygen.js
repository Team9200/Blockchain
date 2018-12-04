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
  return privKey;
}

/*******************************************************************************
  function: getPubKey
  explanaion: 전달된 개인키의 publickey를 반환하는 함수
  input : privatekey
  output: publickey
*******************************************************************************/

var getPubKey = function(privKey) {
  let pubKey = secp256k1.publicKeyCreate(privKey);
  return pubKey;
}

exports.getPrivKey = getPrivKey;
exports.getPubKey = getPubKey;
