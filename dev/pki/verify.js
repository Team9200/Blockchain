const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const Blockchain =

/*
  - 서명의 입력값은 128bit == 32bytes Buffer
  - 입출력 간에 encoding decoding이 반드시 필요함
*/

/*******************************************************************************
  function : verifyPost
  explanaion :
  input :
  output :
********************************************************************************/

var verifyPost = function(post, publickey) {};

/*******************************************************************************
  function : verifyVote
  explanaion :
  input :
  output :
********************************************************************************/

var verifyVote = function(vote, publickey) {}

exports.verifyTransaction = verifyTransaction;
exports.verifyPost = verifyPost;
exports.verifyVote = verifyVote;
