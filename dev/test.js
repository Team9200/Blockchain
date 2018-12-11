const {readChain, writeChain} = require('./#test/sampling/readWriteChain.js');
const Blockchain = require("./mine/mine.js");
let testchain = readChain("./sample2new.json");

testchain.pendingTransactions.push('asdsadasdasdsadasdsad');
testchain.miningBlock();
console.log(testchain);

<<<<<<< HEAD
// writeChain(testchain, 'result.json');
=======

// writeChain(testchain, 'result.json');
>>>>>>> 6512eccf3fbf386785a7e11735eb9b0fc0ebfd20
