
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

function Block(index, timestamp, transactionList, malwaresList, nonce, hash, previousBlockHash) {
  this.index = index;
  this.timestamp = timestamp;
  this.transactionList = transactionList;
  this.malwaresList = malwaresList;
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
  this.pendingMalwares = [];                 // 악성코드정보를 담는 리스트
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
    this.pendingMalwares,
    nonce,
    hash,
    previousBlockHash
  )

  this.pendingTransactions = [];                // 다음 블록을 위한 작업
  this.pendingMalwares = [];
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
  const tx_id = sha256(JSON.stringify(transaction["version"]+transaction["i_ctr"]+transaction["vin"],transaction["o_ctr"],transaction["vout"]));
  const t_vout = [transaction["o_ctr"]];
  for(var i = 0; i < transaction["o_ctr"];i++){
    t_vout[i] = new Object;
    t_vout[i] = transaction["vout"][i];
  }
  
  const t_vin = [transaction["i_ctr"]];
  for(var i = 0; i < transaction["i_ctr"];i++){
    t_vin[i] = new Object;
    t_vin[i] = transaction["vin"][i];
  }
  
  console.log("transaction = ", transaction);
  console.log("t_vin = ",t_vin);
  console.log("t_vout = ", t_vout);


  const newTransaction = {
    tx_id,
    version : transaction["version"],
    i_ctr : transaction["i_ctr"],
    vin : t_vin,
    o_ctr : transaction["o_ctr"],
    vout : t_vout
  }
  
  this.pendingTransactions.push(newTransaction);
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
    sha1: malware["sha1"],
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

  this.pendingMalwares.push(newMalware);
  return this.getLastBlock()['index'] + 1;
};

/*******************************************************************************
  function : searchInBlock
  explanaion : 블록 내부 정보를 조회하는 메소드
  input : key, value
  output : 해당하는 malware의 모든 정보를 반환
********************************************************************************/

Block.prototype.searchInBlock = function (key, value) {
  var result = [];
  var cnt = this.malwaresList.length;

  if (cnt == 0)
    return false;

  for (var i=0; i<cnt; ++i) {
    if(this.malwaresList[i][key] == value)  {
        result.push(this.malwaresList[i]);
    }
  }
  if (result.length == 0) {
    return false;
  }
  else {
    return result;
  }
}

/*******************************************************************************
  function: searchInChain
  explanaion: 체인안에서 모든 블록을 순회하며 정보를 탐색하는 메소드
  input: key, value
  output : 해당하는 malware의 모든 정보를 반환
*******************************************************************************/

Blockchain.prototype.searchInChain = function (key, value) {
  var result = [];
  var temp = [];
  for (var i=0 ; i<this.chain.length; ++i) {
    temp = this.chain[i].searchInBlock(key,value);
    if(temp != false) {
      result = result.concat(temp);
    }
  }

  if (result.length==0)
    return false;
  else
    return result;
};


  

Blockchain.prototype.findAddressUTXO= function (p_key){
  var UTXO_list = [];
  
  console.log("p_key = ", p_key);

  //전체 블록 길이만큼 탐색
  for(var i = 0; i < this.chain.length; i ++){

    var cnt = this.chain[i].transactionList.length;
    console.log("cnt = ",cnt);
    console.log("transactionList = ", this.chain[i].transactionList);
    console.log("chain.length = ",this.chain.length)
    
    // 블록의 트랜잭션의 길이가 0이면 다음 블록으로 진행, 빈 블록이 있을 수 있음 -> 없을 수도 있는거 같다. 일단 두자. 
    if (cnt == 0)
      continue;

    else{
      // 블록의 트랜잭션 리스트의 길이가 0이 아니면 해당 트랜잭션 길이만큼 블록의 트랜잭션 길이만큼 반복문 실행
      for(j = 0; j < cnt; j++){
        var n_vout = this.chain[i].transactionList[j]["o_ctr"];
        console.log("tx_info",this.chain[i].transactionList[j]);
        console.log("vout_ctr",n_vout);
        console.log("vout_info",this.chain[i].transactionList[j]["vout"]);
        
        // 출력 수(o_ctr)만큼 출력(vout)을 돌면서 pubkey를 비교함
        for(jj = 0; jj < n_vout; jj++){
          console.log("this transaction's pub_key = ",this.chain[i].transactionList[j]["vout"][jj]["pub_key"])
          if(this.chain[i].transactionList[j]["vout"][jj]["pub_key"]==p_key){
            var t_tx_id = this.chain[i].transactionList[jj]["tx_id"];
            console.log("find transaction, check it's UTXO...: ",t_tx_id);
            find_Flag = 0; // 찾으면 1로 바꿔서 빠져나감 

            // pubkey를 출력으로 갖는 트랜잭션을 찾았으면, 이후 블록부터 해당 트랜잭션의 id가 vin에 들어있는지 확인함
            for(k = i; k < this.chain.length; k++){
              var tx_len = this.chain[k].transactionList.length;
              console.log("tx_len = ",tx_len);
              console.log("k_transactionList = ", this.chain[k].transactionList);
              
              // 동일하게 트랜잭션 리스트의 길이만큼 반복문 또 실행
              for(kk = 0; kk < tx_len; kk++){
                if(this.chain[k].transactionList[kk]["vin"]["tx_id"]==t_tx_id){
                  console.log(t_tx_id ,"(tx_id) is not UTXO");
                  find_Flag = 1;
                }
              }
              if(find_Flag == 1){
                break;
              }

            }
            if(find_Flag == 1){
              break;
            }
            else{
              UTXO_list = UTXO_list.concat(this.chain[i].transactionList[jj]);
            }
          }

        }



      }
    }
  }
  if (UTXO_list.length==0)
    return false;
  else
    return UTXO_list;  

}

module.exports = Blockchain;








