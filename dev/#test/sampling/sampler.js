const UTXO = require('../../transaction/utxo.js');
const { readChain, writeChain, readList, appendChain} = require('../../util/readWriteChain.js');
const Blockchain = require('../../search.js');
const {getGoodPostLink} = require('./wellmade.js');
const {
  getUserPost,
  getUserPrivate,
  getUserVote,
  getRandomInt,
  getRandomUser,
  getRandomStorage,
  getRandomAnalyzer,
  getRandomCollector,
  getRandomPost } = require('./get.js');

function percent(n) {
  let x = getRandomInt(0,100);
  if ( x < n)
    return true;
  else
    return false;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

Blockchain.prototype.getPermlink = function () {
  let index = this.getLastBlock().index
  let permdict = this.findAllPermlink(index);
  return Object.keys(permdict);
};

Blockchain.prototype.getRandomPermlink = function () {
  let permlist = this.getPermlink();
  return randomItem(permlist);
};

/*****************************************************************/

Blockchain.prototype.voteGoodPost = function () {
  let permlist = getGoodPostLink();
  let user = getRandomInt(0,40);
  let refpermlink = randomItem(permlist);
  let vote = getUserVote(user, refpermlink);
  this.addNewVote(vote);
};

Blockchain.prototype.votePost = function () {
  let permlist = this.getPermlink();
  let user = getRandomInt(0,40);
  let refpermlink = randomItem(permlist);
  let vote = getUserVote(user, refpermlink);
  this.addNewVote(vote);
};

Blockchain.prototype.addRandomPost = function () {
  let usernumber = getRandomInt(10,16);
  let post = getUserPost(usernumber);
  this.addNewPost(post);
};

Blockchain.prototype.addType1Tx = function () {};

Blockchain.prototype.addType0Tx = function () {};

/*****************************************************************/

Blockchain.prototype.miningSample = function (n) {
  let block = this.getLastBlock();
  let height = block['index'];
  for(let i=0; i<n; i++) {
    this.voteGoodPost();
    this.votePost();
    this.addRandomPost();
    this.addRandomPost();
    this.miningBlock();
  }
  this.makeReward(height+n-10,height+n);
  this.votePost();
  this.votePost();
  this.miningBlock();
};

let utxo = new UTXO();
let sample = readChain('./sample4444.json');
sample.miningSample(1);
//sample.miningSample(10);
//writeChain(sample,'./sample4444.json');
console.log(sample);
