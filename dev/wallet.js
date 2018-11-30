const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const ripemd160 = require('ripemd160');
const sha256 = require('sha256');
var search = require('./search');

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

/*******************************************************************************
  function: getWalletAddress
  explanaion: 지갑 주소를 얻어내는 함수
  input : publicKey
  output: 지갑 주소 (비트코인에서의 주소와 같은 형식)
*******************************************************************************/

function getWalletAddress(pubKey){
  let pubkeyhash = ripemd160(sha256(pubKey));
  let address = bs58check(pubkeyhash);
  return address;
}


/*******************************************************************************
  function: P2PrequestTX
  explanaion: 전달 받은 address의 모든 거래 내역을 반환하도록 요청
  input : address
  output: 전달 받은 address 가 관련된 모든 transaction 들의 리스트
*******************************************************************************/

function P2PrequestTX(address) {};

/*******************************************************************************
  function: P2PrequestUTXO
  explanaion: 지갑 사용자의 모든 UTXO를 얻어오는 함수
  input : User의 publickey
  output: 지갑 사용자의 모든 UTXO
*******************************************************************************/

function P2PrequestUTXO(address) {};

/*******************************************************************************
  function: getTotalAmount
  explanaion: utxolist로 부터 사용자가 가지고 있는 돈을 가져옴
  input : 사용자의 utxolist
  output: float 형의 잔액
*******************************************************************************/

function getTotalAmount(utxolist) {};

/*******************************************************************************
  function: getSendList
  explanaion: 출금 내역 출력
  input :
  output:
*******************************************************************************/

function getSendList(txlist) {};

/*******************************************************************************
  function: getReceviceList
  explanaion: 입금 내역
  input :
  output:
*******************************************************************************/

function getReceviceList(txlist) {};
