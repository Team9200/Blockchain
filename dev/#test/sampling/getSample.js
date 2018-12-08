const mine = require('../../mine/mine.js');
const {readChain, writeChain} = require('./readWriteChain');
const { getUserPublic,
 getUserPrivate,
 getUnitTransaction,
 getPostBody,
 getUserPost,
 getUserReply,
 getUserVote } = require('./get');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function pendingRandomSamples(sample) {
  let rand = getRandomInt(100);
  let tr = getUnitTransaction(rand*100+3);
  let body = getPostBody(rand);
  let post = getUserPost(rand,body);
  let post2 = getUserPost(rand+21,body);
  let reply = getUserReply(rand+1,post['permlink']);
  let reply2 = getUserReply(rand+3,post2['permlink']);
  let vote = getUserVote(rand+2, post['permlink']);
  let vote2 = getUserVote(rand+4, post2['permlink']);

  sample.addNewTransaction(tr);
  sample.addNewPost(post);
  sample.addNewPost(post2);
  sample.addNewReply(reply);
  sample.addNewReply(reply2);
  sample.addNewVote(vote);
  sample.addNewVote(vote2);
}

let sample = readChain('./genesisChain.json');

pendingRandomSamples(sample);
sample.miningBlock();
pendingRandomSamples(sample);
pendingRandomSamples(sample);
sample.miningBlock();
pendingRandomSamples(sample);
sample.miningBlock();
console.log(sample);
writeChain(sample,'smallchain.json')
