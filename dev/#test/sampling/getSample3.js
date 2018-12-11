const Blockchain = require('../../mine/mine.js');
const {readChain, writeChain} = require('./readWriteChain');
const { getRandomPost } = require('./get');

const { getGoodPostList } = require('./wellmade.js');

Blockchain.prototype.miningGoodPost = function (goodlist) {
  let length = goodlist.length;
  for (let i=0; i<length; i++) {
    this.addNewPost(goodlist[i]);
    this.addNewPost(getRandomPost());
    this.addNewPost(getRandomPost());

    this.miningBlock();
  }
};

let samplechain = readChain('./genesisChain.json');
let goodlist = getGoodPostList();

samplechain.miningGoodPost(goodlist);
writeChain(samplechain, 'sample3.json');
