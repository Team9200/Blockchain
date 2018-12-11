const Blockchain = require('../../mine/mine.js');
const {readChain, writeChain} = require('../../util/readWriteChain.js');
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
samplechain.miningGoodPost(getGoodPostList());
//writeChain(samplechain, 'sample4.json');
