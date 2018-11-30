
/*******************************************************************************
filename : genesisBlock.js
Autor : rach
date : 18. 11. 03
version : v1.0
explanaion :
- 제네시스 블락을 생성하는 코드

********************************************************************************/

var fs = require('fs');
var Blockchain = require('../blockchain');

var make = function() {
  var genesis = new Blockchain();
  var firstChain = JSON.stringify(genesis);
  fs.writeFileSync("genesisChain.json", firstChain);
}

make();

exports.make = make;
