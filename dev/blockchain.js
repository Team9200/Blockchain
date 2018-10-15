
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

const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

/*******************************************************************************
  function : Blockchain 객체
  explanaion : 전체 블록체인의 정보를 구현한 객체 (ex 비트코인)
               시스템 내에서 하나만을 생성하면 될 것
*******************************************************************************/

function Blockchain() {
  this.chain = [];                          // block을 담는 리스트
  this.transactionList = [];                // 트랜잭션을 담는 리스트
  this.malwaresList = [];                   // 악성코드정보를 담는 리스트
  this.createNewBlock(100, '0', '0');       // genesis block 생성
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
}

function Block() {
  this.index = 0;
  this.timestamp = Date.now();
  this.transactionList = [];
  this.malwareList = [];
  this.nonce = 0;
  this.previousBlockHash ="";
}

/*******************************************************************************
   function : createNewBlock(nonce, previousBlockHash, hash)
   explanaion : 이전 블록의 해쉬값을 전달하고 새로운 블록을 생성하는 함수
   input : nonce - 새로운 블록의 nonce 값 (이를 계산하는 알고리즘은 추가하지 않음)
           previousBlockHash - 이전 블록의 sha-256 해쉬값
           hash - 완성된 블록의 해쉬값 (nonce 값과 비교해서 블록을 검증할 수 있음)
  return : 결과로 생성된 블록 (newBlock)
*******************************************************************************/

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash,hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactionList: this.transactionList,
    malwaresList: this.malwaresList,
    nonce:nonce,
    hash:hash,
    previousBlockHash:previousBlockHash
  };

this.transactionList = [];                // 다음 블록을 위한 작업
this.malwaresList = [];
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

Blockchain.prototype.addNewTransaction = function(transaction) {
  const newTransaction = {
    amount: transaction["amount"],
    sender: transaction["sender"],
    recipient: transaction["recipient"]
  }

  this.transactionList.push(newTransaction);
  return this.getLastBlock()['index'] + 1;
}

/*******************************************************************************
  function : addNewMalware
  explanaion : 새로운 인텔리전스 정보를 생성하는 함수
  input : malware 정보(json format)
  output : 생성된 트랜잭션을 담고 있는 블록의 인덱스 (마지막 블록)
********************************************************************************/

Blockchain.prototype.addNewMalware = function (malware) {
  const newMalware = {
    analyzer: malware["analyzer"],
    md5: malware["md5"],
    sha1: malware["sha-1"],
    sha256: malware["sha256"],
    ssdeep : malware["ssdeep"],
    imphash: malware["imphash"],
    filetype: malware["filetype"],
    tag_name_etc: malware["tag_name_etc"],
    filesize : malware["filesize"],
    behavior : malware["behavior"],
    date : malware["date"],
    first_seen: malware["first_seen"],
    taglist: malware["taglist"],
  }

  this.malwaresList.push(newMalware);
  return this.getLastBlock()['index'] + 1;
};

module.exports = Blockchain;
