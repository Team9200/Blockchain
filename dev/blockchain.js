
/*
Autor : rach
date : 18. 10. 10
version : v0.8
explanaion :

as is
- 구체적인 트랜잭션 구조체나 블록의 구조체가 아니라 틀만 잡혀 있는 상태임
- 현재 express로 웹을 이용해서 로컬상에서 블록 생성 -> 트랜잭션 생성 -> 마이닝 & 결과 확인 까지 가능함

to be
- 목요일까지 로컬이 아니라 다른 PC 에서도 마이닝과 체인 조회가 가능하게 구현할 예정
- 지금까지 얘기된 내용만으로라도 트랜잭션을 추가할 예정임

version info
- 실질적으로 블록을 다른 컴퓨터에서도 조회할 수 있는 시점에 verson 1 로 업데이트 할 예정
*/

const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

/*
  function : Blockchain 객체
  explanaion : 전체 블록체인의 정보를 구현한 객체 (ex 비트코인)
               시스템 내에서 하나만을 생성하면 될 것
*/

function Blockchain() {
  this.chain = [];                    // block을 담는 배열
  this.pendingTransactions = [];      // 트랜잭션을 담는 배열
  this.createNewBlock(100, '0', '0'); // genesis block 생성
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
}

/*
   function : createNewBlock(nonce, previousBlockHash, hash)
   explanaion : 이전 블록의 해쉬값을 전달하고 새로운 블록을 생성하는 함수
   input : nonce - 새로운 블록의 nonce 값 (이를 계산하는 알고리즘은 추가하지 않음)
           previousBlockHash - 이전 블록의 sha-256 해쉬값
           hash - 완성된 블록의 해쉬값 (nonce 값과 비교해서 블록을 검증할 수 있음)
  return : 결과로 생성된 블록 (newBlock)
*/

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash,hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    pendingTransactions: this.pendingTransactions,
    nonce:nonce,
    hash:hash,
    previousBlockHash:previousBlockHash
  };

this.pendingTransactions = [];                // 다음 블록을 위한 작업
this.chain.push(newBlock);

return newBlock;
}

/*
  function : getLastBlock()
  explanaion : 마지막 블록을 반환하는 함수
  input : NULL
  output : NULL
*/

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length -1];
}

/*
  function : createNewTransaction
  explanaion : 새로운 트랜잭션을 생성하는 함수
  input : transaction 정보 (현재는 거래 정보지만 추후에 변경되어야함)
  output : 생성된 트랜잭션을 담고 있는 블록 (마지막 블록)
*/

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  }

  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock()['index'] + 1;
}

/*
  function : hashBlock
  explanaion : 블락의 sha-256 해쉬값을 계산하는 함수
  input : previousBlockHash - 이전 블록의 해쉬
          currentBlockData - 현재 블록의 데이터 (현재 블록을 그냥 전달)
          nonce - nonce 값 후보
  output : block의 sha-256 해쉬값
*/

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash
}

/*
  function : proofOfWork
  explanaion : - nonce 값을 1씩 증가 시켜가며 난이도에 맞는 해쉬값을 계산할 때 까지 반복
              - 현재 난이도가 하드 코딩 되어 있음 추후 업데이트 필요
  input : previousBlockHash - 이전 블록의 해쉬
          currentBlockData - 현재 블록
  output : 난이도를 통과한 해쉬값
*/

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while(hash.substring(0,4) != '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
  }
  return nonce;
}

module.exports = Blockchain;
