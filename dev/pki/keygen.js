const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');

/*******************************************************************************
  function: getPrivKey
  explanaion: 개인키를 얻어내는 함수
  input : NULL
  output: bs58check로 인코딩된 private key
*******************************************************************************/

function getPrivKey() {
  let privKey;
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))
  privKey = bs58check(privKey);            // bs58check 로 인코딩 해서 리턴
  return privKey;
}

/*******************************************************************************
  function: getPubKey
  explanaion: 전달된 개인키의 publickey를 반환하는 함수
  input : privatekey
  output: publickey
*******************************************************************************/

function getPubKey(privKey) {
  let pubKey = secp256k1.publicKeyCreate(privKey);
  pubKey = bs58check(pubKey);               // bs58check로 인코딩 해서 리턴
  return pubKey;
}
