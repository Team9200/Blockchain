const Blockchain = require('../../mine/mine');

const fs = require('fs');
const { readList } = require('./readWriteChain');
const sha256 = require('sha256');
const bs58check = require('bs58check');
const { signPost, signVote } = require('../../pki/sign.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var getUserPublic = function(usernumber) {
  let filename = './pubkeylist.json';
  let publist = fs.readFileSync(filename);
  publist = JSON.parse(publist);
  return publist[usernumber];
}

var getUserPrivate = function(n) {
  let filename = './privkeylist.json';
  let privlist = fs.readFileSync(filename);
  privlist = JSON.parse(privlist);
  return privlist[n];
}

var getRandomMiner = function() {
  let n = getRandomInt(10);
  return getUserPublic(n);
}

var getUnitTransaction = function(value) {
  let transaction = {
    'txid':null,
    'version':1.00,
    'inputCnt':0,
    'vin':null,
    'outputCnt':0,
    'vout':[{}]
  };
  transaction['vout'][0]['value'] = value;
  transaction['vout'][0]['index'] = 0;
  transaction['vout'][0]['publickey'] = getUserPublic(0);
  transaction['txid'] = '04' + sha256(JSON.stringify(transaction));
  return transaction;
}

var getPostBody = function(usernumber) {
  let filename = './malwareslist.json';
  let malwareslist = fs.readFileSync(filename)
  malwareslist = JSON.parse(malwareslist);

  let body = malwareslist[getRandomInt(100)];
  body['analyzer'] = getUserPublic(usernumber);
  body['collector'] = getUserPublic(getRandomInt(1000));
  body['description'] = 'this is test description! in real, it must be more specific.';
  return body;
}

var getUserPost = function(usernumber) {
  let body = getPostBody(usernumber);
  let title = 'analyze of ' + body['sha256'];
  let hashtag = ['test', 'analyzed', 'gosu'];
  let publickey = getUserPublic(usernumber);
  let post = {
    'title':title,
    'timestamp':Date.now(),
    'body':body,
    'hashtag':hashtag,
    'publickey':publickey,
  }
  post['permlink'] = '01' + sha256(JSON.stringify(post));

  let privatekey = bs58check.decode(getUserPrivate(usernumber));
  let sign = signPost(post, privatekey);
  post['sign'] = sign;
  return post;
};

var getUserReply = function(usernumber, refpermlink) {
  let reply = {};
  reply['refpermlink'] = refpermlink;
  reply['timestamp'] = Date.now();
  reply['publickey'] = getUserPublic(usernumber);
  reply['text'] = 'this is test reply comment';
  reply['permlink'] = '02' + sha256(JSON.stringify(reply));

  let privatekey = bs58check.decode(getUserPrivate(usernumber));
  let sign = signPost(reply, privatekey);
  reply['sign'] = sign;
  return reply;
}

var getUserVote = function(usernumber, refpermlink) {
  let vote = {};
  vote['refpermlink'] = refpermlink;
  vote['timestamp'] = Date.now();
  vote['publickey'] = getUserPublic(usernumber);
  vote['weight'] = 5;
  vote['voteid'] = '03' + sha256(JSON.stringify(vote));

  let privatekey = bs58check.decode(getUserPrivate(usernumber));
  let sign = signVote(vote, privatekey);
  vote['sign'] = sign;

  return vote;
}

module.exports = {
  getUserPublic: getUserPublic,
  getUserPrivate: getUserPrivate,
  getRandomMiner: getRandomMiner,
  getUnitTransaction: getUnitTransaction,
  getPostBody: getPostBody,
  getUserPost: getUserPost,
  getUserReply: getUserReply,
  getUserVote: getUserVote
}
