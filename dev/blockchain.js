/*
Autor : rach
date : 18. 10. 7
version : v1.0
explanaion :

*/

const sha256 = require('sha256');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.createNewBlock(100, '0', '0'); // genesis block 생성
}

// 블록체인 프로토 타입 함수 정의
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash,hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce:nonce,
    hash:hash,
    previousBlockHash:previousBlockHash
  };

// 다음 거래를 위한 거래 내역 배열 비워주고 새로운 블록을 chain 배열에 추가
this.pendingTransactions = [];
this.chain.push(newBlock);

return newBlock;
}

// 마지막 블록을 반환하는 함수
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length -1];
}

// 새로운 트랜잭션이 발생했을 때 작동하는 함수
// 인자값으로 총액수 / 보내는 사람 / 받는 사람이 들어간다.
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  }

  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock()['index'] + 1;
}

// 해쉬값 계산하는 함수
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash
}

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
