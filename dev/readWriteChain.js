var fs = require('fs');
var Blockchain = require('./mine');
var marlist = [];

Blockchain.prototype.Blockchain = function (input) {
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

exports.readChain = readChain;
exports.writeChain = writeChain;
