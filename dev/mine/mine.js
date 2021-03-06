const sha256 = require('sha256');
const secp256k1 = require('secp256k1')
const bs58check = require('bs58check');
const {getRandomStorage} = require('../#test/sampling/get.js');

var Blockchain = require('../blockchain');

/*******************************************************************************
  function : hashBlock
  explanaion : 블락의 sha-256 해쉬값을 계산하는 함수
  input : previousBlockHash - 이전 블록의 해쉬
          currentBlockData - 현재 블록의 데이터 (현재 블록을 그냥 전달)
          nonce - nonce 값 후보
  output : block의 sha-256 해쉬값
********************************************************************************/

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash
}

/*******************************************************************************
  function : proofOfWork
  explanaion : - nonce 값을 1씩 증가 시켜가며 난이도에 맞는 해쉬값을 계산할 때 까지 반복
              - 현재 난이도가 하드 코딩 되어 있음 추후 업데이트 필요
  input : previousBlockHash - 이전 블록의 해쉬
          currentBlockData - 현재 블록
  output : 난이도를 통과한 해쉬값
********************************************************************************/

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while(hash.substring(0,4) != '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
  }
  return nonce;
}

/*******************************************************************************
  function : miningBlock
  explanaion : 현재 블록을 mining
  input : 보상과 난이도
  return : lastblock
  *******************************************************************************/

Blockchain.prototype.miningBlock = function (minerPublicKey) {
  const lastBlock = this.getLastBlock();
  const previousBlockHash = lastBlock.hash;

  const currentBlockData = {
    index: lastBlock['index']+1,
    post: this.pendingPosts,
    reply: this.pendingReplies,
    vote: this.pendingVotes,
    transaction: this.pendingTransactions
  };

  const nonce = this.proofOfWork(previousBlockHash,currentBlockData);
  const blockHash = this.hashBlock(previousBlockHash,currentBlockData,nonce);

  //채굴에 대한 보상
  let miner = minerPublicKey;
  var reward = {
    "txid":null,
    "timestamp":Date.now(),
    "version": 1.00,
    "type":0,
    "inputCnt": 0,
    "vin": null,
    "outputCnt": 1,
    "vout": [
      {
      "index" : 0,
      "value" : 10,
      "publickey" : miner // publicKey 로 되어있어서 출력 안뜨던 버그 있었음!
    }]
  };
  reward['txid'] = '04' + sha256(JSON.stringify(reward));

  this.addNewTransaction(reward);
  const newBlock = this.createNewBlock(nonce, previousBlockHash, blockHash);
  return newBlock;
};

module.exports = Blockchain;
