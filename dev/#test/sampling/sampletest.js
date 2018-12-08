const fs = require('fs');

const readWriteChain = require('./readWriteChain');
const Blockchain = require('../../mine/mine');
var readChain = readWriteChain.readChain;
var writeChain = readWriteChain.writeChain;
let filename = './smallchain.json';

var localChain = fs.readFileSync(filename);
localChain = JSON.parse(localChain);
console.log(localChain);
