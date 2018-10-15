
var Blockchain = require('./blockchain');

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
  function: isBlockValid
  explanaion: 블락의 sha -256 해쉬값이 올바른지 확인하는 함수
  input : 확인하고자 하는 블락
  output: true, false

  note : 이 함수는 다른 모듈로 있는게 좋을 것 같다.
         hashBlock 과 함께
*******************************************************************************/

function isBlockValid(block) {

};

/*******************************************************************************
  function: isChainValid
  explanaion: blockchain의 block 들이 유효하게 연결되어 있는지 확인하는 함수
  input:
  output: true, false
*******************************************************************************/

blockchain.prototype.isChainValid = function () {

};

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

module.exports = Blockchain;
