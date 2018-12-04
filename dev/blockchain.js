
/*******************************************************************************
filename : blockchain.js
Autor : rach
date : 18. 10. 15
version : v0.87
explanaion :
  - 블록체인 구조체를 정의한 파일
  - 트랜잭션, 악성코드 정보를 추가하는 메소드들이 정의되어 있음
  - 마이닝, 검증 메소드는 mine.js로 분리함

********************************************************************************/

const currentNodeUrl = process.argv[3]; // for test
const sha256 = require('sha256');

/*******************************************************************************
  function : Block 객체
  explanaion : 블록체인 안에 들어갈 block을 객체화 함

*******************************************************************************/

function Block(index, timestamp, postList, replyList, voteList, transactionList, nonce, hash, previousBlockHash) {
  this.index = index;
  this.timestamp = timestamp;
  this.postList = postList;
  this.replyList = replyList;
  this.voteList = voteList;
  this.transactionList = transactionList;
  this.nonce = nonce;
  this.hash = hash;
  this.previousBlockHash = previousBlockHash;
}

/*******************************************************************************
  function : Blockchain 객체
  explanaion : 전체 블록체인의 정보를 구현한 객체 (ex 비트코인)
               시스템 내에서 하나만을 생성하면 될 것
*******************************************************************************/

function Blockchain() {
  this.chain = [];                            // block을 담는 리스트
  this.pendingPosts = [];                     // 악성코드정보를 담는 리스트
  this.pendingReplies = [];                   // 대답 정보를 담는 리스트
  this.pendingVotes = [];                     // 투표 정보를 담는 리스트
  this.pendingTransactions = [];              // 트랜잭션을 담는 리스트
  this.createNewBlock(100, '0', '0');         // genesis block 생성
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
}

/*******************************************************************************
   function : createNewBlock(nonce, previousBlockHash, hash)
   explanaion : 이전 블록의 해쉬값을 전달하고 새로운 블록을 생성하는 함수
   input : nonce - 새로운 블록의 nonce 값 (이를 계산하는 알고리즘은 추가하지 않음)
           previousBlockHash - 이전 블록의 sha-256 해쉬값
           hash - 완성된 블록의 해쉬값 (nonce 값과 비교해서 블록을 검증할 수 있음)
  return : 결과로 생성된 블록 (newBlock)
*******************************************************************************/

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = new Block(
    this.chain.length + 1,
    Date.now(),
    this.pendingPosts,
    this.pendingReplies,
    this.pendingVotes,
    this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash
  )

  this.pendingPosts = [];               // 다음 블록을 위한 작업
  this.pendingReplies = [];
  this.pendingVotes = [];
  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
}

/*******************************************************************************
  function : getLastBlock()
  explanaion : 마지막 블록을 반환하는 함수
  input : NULL
  output : NULL
*******************************************************************************/

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length -1];
}

/*******************************************************************************
  function : addNewPost
  explanaion : 새로운 인텔리전스 정보를 생성하는 함수
  input : post 정보(json format)
  output : 생성된 트랜잭션을 담고 있는 블록의 인덱스 (마지막 블록)
********************************************************************************/

Blockchain.prototype.addNewPost = function (post) {
  const newBody = {                                 // 실제 분석정보가 들어가는 부분
    analyzer: post.body['analyzer'],
    collector: post.body['collector'],
    md5: post.body['md5'],
    sha1: post.body['sha1'],
    sha256: post.body['sha256'],
    filetype: post.body['filetype'],
    tag_name_etc: post.body['tag_name_etc'],
    filesize : post.body['filesize'],
    behavior : post.body['behavior'],
    date : post.body['date'],
    first_seen: post.body['first_seen'],
    taglist: post.body['taglist'],
    discription: post.body['discription']                // maybe markdown format?
  }
  const newPost = {
    title: post['title'],
    timestamp: Date.now(),
    body: newBody,
    hashtag: post['hashtag'],
    publickey: post['publickey'],
    sign: post['sign'],
    permlink: post['permlink']
  }

  this.pendingPosts.push(newPost);
  return this.getLastBlock()['index'] + 1;
};


/*******************************************************************************
  function : addNewReply
  explanaion : 새로운 답글을 추가하는 메소드
  input : json format reply
  output : NULL
********************************************************************************/

Blockchain.prototype.addNewReply = function (reply) {
  const newReply = {
    permlink: reply['permlink'],
    refpermlink: reply['refpermlink'],
    timestamp: Date.now(),
    publickey: reply['publickey'],
    sign: reply['sign'],
    text: reply['text']
  }

  this.pendingReplies.push(newReply);
  return this.getLastBlock()['index'] + 1;
};

/*******************************************************************************
  function : addNewVote
  explanaion : 새로운 투표를 추가하는 메소드
  input : json format vote
  output : NULL
********************************************************************************/

Blockchain.prototype.addNewVote = function (vote) {
  const newVote = {
    refpermlink: vote['refpermlink'],
    timestamp: Date.now(),
    publickey: vote['publickey'],
    sign: vote['sign'],
    weight: vote['weight']
  }

  this.pendingVotes.push(newVote);
  return this.getLastBlock()['index'] + 1;
};

/*******************************************************************************
  function : addNewTransaction
  explanaion : 새로운 트랜잭션을 생성하는 함수
  input : transaction 정보 json format
  output : 생성된 트랜잭션을 담고 있는 블록의 인덱스 (마지막 블록)
********************************************************************************/

Blockchain.prototype.addNewTransaction = function (transaction) {

  const t_vin = [transaction["inputCnt"]];
  for(var i = 0; i < transaction["inputCnt"];i++){
    t_vin[i] = new Object;
    t_vin[i]["txid"] = transaction["vin"][i]["txid"];
    t_vin[i]["index"] = transaction["vin"][i]["index"];
    t_vin[i]["sig"] = transaction["vin"][i]["sig"];
  }

  const t_vout = [transaction["vout"]];
  for(var i = 0; i < transaction["outputCnt"];i++){
    t_vout[i] = new Object;
    t_vout[i]["value"] = transaction["vout"][i]["value"];
    t_vout[i]["index"] = transaction["vout"][i]["index"];
    t_vout[i]["publicKey"] = transaction["vout"][i]["publicKey"];
  }


  const newtransaction = {
    txid: sha256(JSON.stringify(transaction)+Date.now()),
    //txid: sha256(JSON.stringify(transaction)),
    version: transaction["version"],

    inputCnt: transaction["inputCnt"],
    vin: t_vin,

    outputCnt : transaction["outputCnt"],
    vout: t_vout

  }
  this.pendingTransactions.push(newtransaction);
  return this.getLastBlock()['index'] + 1;
};

module.exports = Blockchain;
