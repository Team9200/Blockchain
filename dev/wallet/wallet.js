const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const ripemd160 = require('ripemd160');
const sha256 = require('sha256');

const {} = require('../search');



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
