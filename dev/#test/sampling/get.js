const getTimeStamp = require('../../util/getTimeStamp');

const fs = require('fs');
const { readList } = require('../../util/readWriteChain.js');
const sha256 = require('sha256');
const bs58check = require('bs58check');
const { signPost, signVote } = require('../../pki/sign.js');

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

var getUnitTransaction = function(value) {
  let transaction = {
    'txid':null,
    'version':1.00,
    'type':0,
    'inputCnt':0,
    'vin':null,
    'outputCnt':1,
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
  let malwareslist = readList(filename);

  let body = malwareslist[getRandomInt(0,1000)];
  body['analyzer'] = getUserPublic(usernumber);
  body['collector'] = getRandomCollector();
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
    'timestamp':getTimeStamp(),
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
  reply['timestamp'] = getTimeStamp();
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
  vote['timestamp'] = getTimeStamp();
  vote['publickey'] = getUserPublic(usernumber);
  vote['weight'] = 5;
  vote['voteid'] = '03' + sha256(JSON.stringify(vote));

  let privatekey = bs58check.decode(getUserPrivate(usernumber));
  let sign = signVote(vote, privatekey);
  vote['sign'] = sign;

  return vote;
}

/* random modules */

var getRandomPost = function() {
  let rand = getRandomInt(0,1000);
  return getUserPost(rand);
}

/* getRandomUser module */

var getRandomUser = function() {
  let rand = getRandomInt(0,40);
  return getUserPublic(rand);
}

var getRandomStorage = function() {
  let n = getRandomInt(0,5);
  return getUserPublic(n);
}

var getRandomAnalyzer = function() {
  let n = getRandomInt(10,15);
  return getUserPublic(n);
}

var getRandomCollector = function() {
  let n = getRandomInt(20,40);
  return getUserPublic(n);
}

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  getUserPublic: getUserPublic,
  getUserPrivate: getUserPrivate,
  getUnitTransaction: getUnitTransaction,
  getPostBody: getPostBody,
  getUserPost: getUserPost,
  getUserReply: getUserReply,
  getUserVote: getUserVote,
  getRandomInt: getRandomInt,
  getRandomUser: getRandomUser,
  getRandomStorage: getRandomStorage,
  getRandomAnalyzer: getRandomAnalyzer,
  getRandomCollector: getRandomCollector,
  getRandomPost: getRandomPost
}
