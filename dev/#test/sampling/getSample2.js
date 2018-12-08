const Blockchain = require('../../mine/mine.js');
const {readChain, writeChain} = require('./readWriteChain');
const { getUserPublic,
 getUserPrivate,
 getUnitTransaction,
 getUserPost,
 getUserReply,
 getUserVote } = require('./get');

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
 }

function getPostList() {
  let result = [];
  for(let i=0; i<10; i++)
    result.push(getUserPost(i));
  return result;
}

function getPermList(postlist) {
  let result = postlist.map(x=>{return x['permlink']});
  return result;
}

function getReplyList(permlist) {
  let result = [];
  let rand = getRandomInt(25);
  for (let i=0; i<permlist.length ; i++) {
    result.push(getUserReply(rand, permlist[i]));
  }
  return result;
}

function getVoteList(permlist) {
  let result =[];
  let rand = getRandomInt(25);
  for (let i=0; i<permlist.length; i++) {
    result.push(getUserVote(rand,permlist[i]));
  }
  return result;
}

let postlist = getPostList();
let permlist = getPermList(postlist);


Blockchain.prototype.sampling = function () {
  let postlist = getPostList();
  let permlist = getPermList(postlist);
  let replylist = getReplyList(permlist);
  let votelist = getVoteList(permlist);

  this.pendingPosts.push(postlist.pop());
  this.miningBlock();

  for(let i=0;i<9;i++) {
    this.pendingPosts.push(postlist.pop());
    this.pendingVotes.push(votelist.pop());
    this.pendingReplies.push(replylist.pop());
    this.miningBlock();
  }

  this.pendingVotes.push(votelist.pop());
  this.pendingReplies.push(replylist.pop());
  this.miningBlock();
};

let samplechain = readChain('./genesisChain.json');
samplechain.sampling();
writeChain(samplechain, 'sample2.json');
