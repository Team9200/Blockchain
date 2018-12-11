const {readChain, writeChain} = require('./#test/sampling/readWriteChain.js');
const Blockchain = require("./mine/mine.js");
let testchain = readChain("./sample2new.json");

testchain.pendingTransactions.push('asdsadasdasdsadasdsad');
testchain.miningBlock();
console.log(testchain);

// writeChain(testchain, 'result.json');
