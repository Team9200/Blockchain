const fs = require('fs');
const Blockchain = require('../blockchain.js');

/*******************************************************************************
filename : readWriteChain.js
Autor : rach
date : 18. 11. 03
version : v1.0
explanaion :
  - json 포맷의 체인을 읽을 수 있도록 구현
  - 만들어진 체인을 json 파일로 쓸 수 있게 구현
********************************************************************************/

Blockchain.prototype.Blockchain = function (input) {
  this.chain = input.chain;
  this.pendingTransactions = input.pendingTransactions;
  this.pendingPosts = input.pendingPosts;
};

/*******************************************************************************
   function : readChain(filename)
   explanaion : json 형태로 저장된 체인을 읽을 수 있도록 하는 함수
   input : filename - 읽을 파일의 이름
   return : Blockchain 객체
*******************************************************************************/

var readChain = function(filename) {
  var localChain = fs.readFileSync(filename);
  localChain = JSON.parse(localChain);
  let result = new Blockchain();
  result.chain = localChain.chain;
  result.pendingPosts = localChain.pendingPosts;
  result.pendingVotes = localChain.pendingVotes;
  result.pendingReplies = localChain.pendingReplies;
  result.pendingTransactions = localChain.pendingTransactions;
  return result;
}

/*******************************************************************************
   function : writeChain(localChain, filename)
   explanaion : 블록체인 객체를 json 형태로 저장하는 함수
   input : localChain - json 으로 변환할 블록체인의 인스턴스
           filename - 저장할 파일의 이름
   return : void
*******************************************************************************/

var writeChain = function(localChain, filename){
    var localChainFile = JSON.stringify(localChain);
    fs.writeFileSync(filename, localChainFile);
}

/*******************************************************************************
   function : appendChain(filename)
   explanaion : 기존에 가지고 있는 체인에 새로 전송받은 체인을 이어 붙이는 함수
   input : localChain, newBlock
   return : null
*******************************************************************************/

var appendChain = function(localChain, newblock) {
  let lastblock = localChain.getLastBlock();
  if (lastblock['hash'] != newblock['previousBlockHash'])
    return false;
  else
    localChain['chain'].push(newblock);
  return localChain;
}

/*******************************************************************************
   function : readList(filename)
   explanaion : List 를 읽어오는 함수
   input :
   return : void
*******************************************************************************/

var readList = function(filename) {
  var locallist = fs.readFileSync(filename);
  locallist = JSON.parse(locallist);
  return locallist;
}

exports.Blockchain = Blockchain;
exports.readChain = readChain;
exports.writeChain = writeChain;
exports.readList = readList;
