
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

function Block(index, timestamp, transactionList, postsList, nonce, hash, previousBlockHash) {
  this.index = index;
  this.timestamp = timestamp;
  this.transactionList = transactionList;
  this.postsList = postsList;
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
  this.chain = [];                           // block을 담는 리스트
  this.pendingTransactions = [];             // 트랜잭션을 담는 리스트
  this.pendingPosts = [];                 // 악성코드정보를 담는 리스트
  this.createNewBlock(100, '0', '0');        // genesis block 생성
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
    this.pendingTransactions,
    this.pendingPosts,
    nonce,
    hash,
    previousBlockHash
  )

  this.pendingTransactions = [];                // 다음 블록을 위한 작업
  this.pendingPosts = [];
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
  function : addNewTransaction
  explanaion : 새로운 트랜잭션을 생성하는 함수
  input : transaction 정보 json format
  output : 생성된 트랜잭션을 담고 있는 블록의 인덱스 (마지막 블록)
********************************************************************************/

Blockchain.prototype.addNewTransaction = function (transaction) {
  const newtransaction = {
    txid: sha256(JSON.stringify(transaction)),
    version: transaction["version"],

    inputCnt: transaction["inputCnt"],
    vin: {
      txid: transaction["vin"]["txid"],
      index: transaction["vin"]["index"],
      sig: transaction["vin"]["sig"],
    },

    outputCnt : transaction["outputCnt"],
    vout: {
      value: transaction["vout"]["value"],
      publicKey: transaction["vout"]["publicKey"]
    }
  }
  this.pendingTransactions.push(newtransaction);
  return this.getLastBlock()['index'] + 1;
};

/*******************************************************************************
  function : addNewPost
  explanaion : 새로운 인텔리전스 정보를 생성하는 함수
  input : post 정보(json format)
  output : 생성된 트랜잭션을 담고 있는 블록의 인덱스 (마지막 블록)
********************************************************************************/

Blockchain.prototype.addNewPost = function (post) {
  const newPost = {
    azid: sha256(JSON.stringify(post)),
    analyzer: post["analyzer"],
    collector: post["collector"],
    md5: post["md5"],
    sha1: post["sha1"],
    sha256: post["sha256"],
    filetype: post["filetype"],
    tag_name_etc: post["tag_name_etc"],
    filesize : post["filesize"],
    behavior : post["behavior"],
    date : post["date"],
    first_seen: post["first_seen"],
    taglist: post["taglist"],
    discription: post["discription"]       // maybe markdown format?
  }

  this.pendingPosts.push(newPost);
  return this.getLastBlock()['index'] + 1;
};



module.exports = Blockchain;
