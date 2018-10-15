var fs = require('fs');
var Blockchain = require('./blockchain');

var make = function() {
  var genesis = new Blockchain();
  var firstChain = JSON.stringify(genesis);
  fs.writeFileSync("genesisChain.json", firstChain);
}

exports.make = make;
