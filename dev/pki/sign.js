const secp256k1 = require('secp256k1')
const bs58check = require('bs58check');

/*
  - 서명의 입력값은 128bit == 32bytes Buffer
  - 입출력 간에 encoding decoding이 반드시 필요함
*/

/*******************************************************************************
  function : signTransaction
  explanaion : 트랜잭션 아이디(트랜잭션의 해쉬의 앞에서 부터 절반 자른값)을 개인키로
              서명하는 함수
  input : transaction(json), privkey(buffer array)
  output : signiture(buffer array)
********************************************************************************/

var signTransaction = function(transaction, privatekey) {
  let msg = Buffer.from(transaction['txid'].slice(0,32));
  let sign = secp256k1.sign(msg, privatekey);
  return sign.signature;
}

/*******************************************************************************
  function : signPost
  explanaion : post 또는 reply의 permlink를 개인키로 서명하는 함수
  input : transaction(json) or reply(json) // privkey(buffer array)
  output : signiture(buffer array)
********************************************************************************/

var signPost = function(post, privatekey) {
  let msg = Buffer.from(post['permlink'].slice(0,32));
  let sign = secp256k1.sign(msg, privatekey);
  return sign.signature;
}

/*******************************************************************************
  function : signVote
  explanaion : vote의 voteid를 개인키로 서명하는 함수
  input : vote(json) // privkey(buffer array)
  output : signiture(buffer array)
********************************************************************************/

var signVote = function(vote, privatekey) {
  let msg = Buffer.from(vote['voteid'].slice(0,32));
  let sign = secp256k1.sign(msg, privatekey);
  return sign.signature;
}

exports.signTransaction = signTransaction;
exports.signPost = signPost;
exports.signVote = signVote;
