const mine = require('../mine/mine.js');
const {readChain, writeChain} = require('./sampling/readWriteChain');
const { getUserPublic,
 getUserPrivate,
 getUnitTransaction,
 getPostBody,
 getUserPost,
 getUserReply,
 getUserVote } = require('./sampling/get');

let sample = readChain('./smallchain.json');
console.log(sample);
