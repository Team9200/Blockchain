const sha256 = require('sha256');
const secp256k1 = require('secp256k1');
var Blockchain = require('../search') // need exports

/*******************************************************************************
  function: sumVoutValue
  explanaion: 트랜잭션의 Vout에 해당하는 트랜잭션의 value 들의 합
  input : transaction
  output: float
*******************************************************************************/

function sumVoutValue(trnasaction) {
  let result = 0;
  for (let value in transaction["vout"]["value"])
    result += value;
  return result;
}

/*******************************************************************************
  function: sumVinValue
  explanaion: 트랜잭션의 Vin에 해당하는 트랜잭션의 value 들의 합
  input : transaction
  output: float
*******************************************************************************/

function sumVinValue(transaction) {
  let reuslt = 0;
  let tr;
  for (let vin in transaction["vin"]) {
    tr = findTransaction(utxopool, vin["txid"])
    if (tr==false) return false;
    result += tr["vout"][vin["index"]]["value"];
  }
  return result;
}

/*******************************************************************************
  function: compareVinVout
  explanaion: Vin과 Vout의 합계를 비교함
  input : transaction
  output: float
*******************************************************************************/

function compareVinVout(transaction) {
  return sumVoutValue(transaction)-sumVinValue(transaction);
}

/*******************************************************************************
  function: findTransaction
  explanaion: 입력 받은 txid에 해당하는 transaction을 찾는 함수
  input : utxopool, txid
  output: transaction
*******************************************************************************/

function findTransaction(utxopool, txid) {
  for(var utxo in utxopool) {
    if (utxo["txid"] != undefined)
      return utxo;
  }
  return false
};

/*******************************************************************************
  function: verifyTxSig
  explanaion: transaction의 서명값을 검증하는 함수
  input : transaction의 서명을
  output:
*******************************************************************************/


/*******************************************************************************
  function: verifyTransaction
  explanaion: 트랜잭션의 유효성을 판단하는 함수
  input : 유효성을 확인하고자 하는 트랜잭션
  output: true, false
*******************************************************************************/

function verifyTransaction(transaction) {
  const utxolist = findAddressUTXO(transaction["vout"]["publickey"]);   // need to be fixed
  let tx, txid, publickey;

  if (utxolist == false) return false;
  if (compareVinVout(transaction<0)) return false;

  for (var vin in transaction["vin"]) {
    tx = findTransaction(utxolist, vin["txid"]);
    txid = tx["txid"];
    publickey = tx["vout"][vin["index"]]["publickey"]

    if (secp256k1.verify(txid, vin["signature"], publickey) == false)
      return false;
  }
  return true;
}

/*******************************************************************************
  function: isBlockLinked
  explanaion: 블락의 sha -256 해쉬값이 올바른지 확인하는 함수
  input : 확인하고자 하는 블락
  output: true, false

  note : 이 함수는 다른 모듈로 있는게 좋을 것 같다.
         hashBlock 과 함께
*******************************************************************************/

Blockchain.prototype.isBlockLinked = function () {};

/*******************************************************************************
  function: isChainValid
  explanaion: blockchain의 block 들이 유효하게 연결되어 있는지 확인하는 함수
  input:
  output: true, false
*******************************************************************************/

Blockchain.prototype.isChainValid = function () {};
