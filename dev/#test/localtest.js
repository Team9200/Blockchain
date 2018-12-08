const {readChain} = require('./sampling/readWriteChain');

let sample = readChain('./sample2.json');
console.log(sample.chain[2]);
console.log(sample.chain[3]);
