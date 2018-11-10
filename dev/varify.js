function findAddressUTXO(address){};

function findTransaction(utxopool, txid){
  let result = [];
  for(var utxo in utxopool) {
    if (utxo["txid"] == txid)
      result.push(utxo);
  }
  return result;
};

/*******************************************************************************
  function: verifyTransaction
  explanaion: 트랜잭션의 유효성을 판단하는 함수
  input : 유효성을 확인하고자 하는 트랜잭션
  output: true, false
*******************************************************************************/

function verifyTransaction(transaction) {
  const utxolist = findAddressUTXO(transaction["vout"]["publickey"]);
  if (utxolist == false) return false;
  for (var in transaction["vin"]) {
    if (input["txid"] == )
  } 
}

/*******************************************************************************
  function: isBlockValid
  explanaion: 블락의 sha -256 해쉬값이 올바른지 확인하는 함수
  input : 확인하고자 하는 블락
  output: true, false

  note : 이 함수는 다른 모듈로 있는게 좋을 것 같다.
         hashBlock 과 함께
*******************************************************************************/

function isBlockValid(block) {};

/*******************************************************************************
  function: isChainValid
  explanaion: blockchain의 block 들이 유효하게 연결되어 있는지 확인하는 함수
  input:
  output: true, false
*******************************************************************************/

Blockchain.prototype.isChainValid = function () {};
