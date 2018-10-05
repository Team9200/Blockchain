function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
}

// 블록체인 프로토 타입 함수 정의
Blockchain.prototype.createNewBlock = function(nocnce, previousBlockHash,hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Data.now(),
    transactions: this.newTransactions,
    nonce:nonce,
    hash:hash,
    previousBlockHash:previousBlockHash
  };

// 다음 거래를 위한 거래 내역 배열 비워주고 새로운 블록을 chain 배열에 추가
this.newTransactions = [];
this.chain.push(newBlock);

return newBlock;

}

module.exports = Blockchain;
