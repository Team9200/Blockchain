var fs = require('fs');
var Blockchain = require('./mine');
var marlist = [];

Blockchain.prototype.blockchain = function (input) {
  this.chain = input.chain;
  this.pendingTransactions = input.pendingTransactions;
  this.pendingMalwares = input.pendingMalwares;
};

var readChain = function(filename) {
  var localChain = fs.readFileSync(filename);
  localChain = JSON.parse(localChain);
  localChain = new Blockchain(localChain);
  return localChain;
}

var writeChain = function(localChain, filename){
    var localChainFile = JSON.stringify(localChain);
    fs.writeFileSync(filename, localChainFile);
}

var localChain = readChain("rach.json"); // 인자 파일이름으로 변경
localChain.pendingMalwares = marlist;    // marlist 가 트랜잭션 리스트
localChain.miningBlock();                // mining
writeChain(localChain, "rach2.json");
