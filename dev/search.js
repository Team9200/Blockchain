var Blockchain = require('./blockchain');

/*******************************************************************************
  function : searchInBlock
  explanaion : 블록 내부 정보를 조회하는 메소드
  input : key, value
  output : 해당하는 post의 모든 정보를 반환
********************************************************************************/

Blockchain.prototype.searchInBlock = function (key, value) {
    var result = [];
    var cnt = this.postsList.length;

    if (cnt == 0)
      return false;

    for (var i=0; i<cnt; ++i) {
      if(this.postsList[i][key] == value)  {
          result.push(this.postsList[i]);
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
    output : 해당하는 post의 모든 정보를 반환
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




  
  include = function(arr, index) {
    for(var i=0; i<arr.length; i++) {
      if (arr[i]["index"] == index) return true;
    }
  }



/*******************************************************************************
  function : originfindAllUTXOs
  explanaion : 블록 내부의 Trnasaction들을 조회해서 UTXO를 담고 있는 txid를 key로 갖고, tx의 전체 JSON을  해당 트랜잭션의
  UTXO들의 index를 담은 배열을 value로 갖는 Dictionary를 return한다.

  input : 없음
  output : Dictionary(transaction : UTXOindex[])
********************************************************************************/

Blockchain.prototype.originfindAllUTXOs = function(){
  var UTXO_dict = {};

  // 전체 블록 길이만큼 탐색
  for(var i = 0; i < this.chain.length; i ++){

    //현재 블록의 트랜잭션 수를 cnt라는 변수에 저장
    var cnt = this.chain[i].transactionList.length;

    if (cnt == 0)
      continue;
    
    else {
      // 현재 블록 내부의 트랜잭션 수(cnt) 만큼 반복문 실행
      for (var j = 0; j < cnt; j++){
        
        t_tx = this.chain[i].transactionList[j];
        t_input_cnt = t_tx["inputCnt"];
        t_txid = t_tx["txid"];
        t_vin = t_tx["vin"];
        //inputCnt만큼 for문을 돌면서 vin에서 각 index마다 참조하는 transaction과 해당 index를 UTXOdict에서 찾는다.
        for (var k = 0; k < t_input_cnt; k++){
          reference_txid = t_tx["vin"][k]["txid"];
          // 현재 UTXOdict에 존재한다면 UTXOindex[]에 해당 index를 삭제한다.
          for(var key in UTXO_dict){
           
            if (key== reference_txid && include(UTXO_dict[key],t_vin[k]["index"])){
           
              UTXO_dict[key].splice((UTXO_dict[key].indexOf(t_vin[k]["index"])),1);
              
              // UTXOindex[]의 길이가 1이면 dictionary에서 해당 tx를 삭제한다.
              if(UTXO_dict[key].length == 1){
                delete UTXO_dict[key];
              }
            }
          }
        }
        
        //outputCnt를 구하고 transaction과 UTXOindex[]를 UTXO_dict에 추가한다.
        t_output_cnt = t_tx["outputCnt"];
        t_vout = t_tx["vout"];
        temp_array = [];
        temp_array[0] = JSON.stringify(t_tx);

        for(var k = 0; k < t_output_cnt; k++){
          temp_array.push(k);
        }
        
        UTXO_dict[t_tx["txid"]] = temp_array;
      }
    }
  }

  return UTXO_dict;
}

/*******************************************************************************
  function : findAllUTXOs
  explanaion : 블록 내부의 Trnasaction들을 조회해서 UTXO를 담고 있는 txid를 key로 갖고, tx의 전체 JSON을  해당 트랜잭션의
  UTXO들의 index를 담은 배열을 value로 갖는 Dictionary를 return한다.

  input : 없음
  output : Dictionary(transaction : vout[])
********************************************************************************/
Blockchain.prototype.findAllUTXOs = function(){
  var UTXO_dict = {};

  // 전체 블록 길이만큼 탐색
  for(var i = 0; i < this.chain.length; i ++){

    //현재 블록의 트랜잭션 수를 cnt라는 변수에 저장
    var cnt = this.chain[i].transactionList.length;

    if (cnt == 0)
      continue;
    
    else {
      // 현재 블록 내부의 트랜잭션 수(cnt) 만큼 반복문 실행
      for (var j = 0; j < cnt; j++){
        
        t_tx = this.chain[i].transactionList[j];
        t_input_cnt = t_tx["inputCnt"];
        t_txid = t_tx["txid"];
        t_vin = t_tx["vin"];
        //inputCnt만큼 for문을 돌면서 vin에서 각 index마다 참조하는 transaction과 해당 index를 UTXOdict에서 찾는다.
        for (var k = 0; k < t_input_cnt; k++){
          reference_txid = t_tx["vin"][k]["txid"];
          // 현재 UTXOdict에 존재한다면 UTXOindex[]에 해당 index를 삭제한다.
          for(var key in UTXO_dict){
           
            if (key== reference_txid && include(UTXO_dict[key],t_vin[k]["index"])){
           
              UTXO_dict[key].splice((UTXO_dict[key].indexOf(t_vin[k]["index"])),1);
              
              // UTXOindex[]의 길이가 1이면 dictionary에서 해당 tx를 삭제한다.
              if(UTXO_dict[key].length == 0){
                delete UTXO_dict[key];
              }
            }
          }
        }
        
        //outputCnt를 구하고 transaction과 UTXOindex[]를 UTXO_dict에 추가한다.
        t_output_cnt = t_tx["outputCnt"];
        t_vout = t_tx["vout"];
        temp_array = [];

        for(var k = 0; k < t_output_cnt; k++){
          temp_array.push(t_vout[k]);
        }
        
        UTXO_dict[t_tx["txid"]] = temp_array;
      }
    }
  }

  return UTXO_dict;
}

/*******************************************************************************
  function : findMyUTXOs
  explanaion : 블록 내부의 Trnasaction들을 조회해서 UTXO를 담고 있는 txid를 key로 갖고,
  해당 Trnasaction에서 나의 주소를 가르키는 vout을 value로 갖는다.

  input : address (UTXO를 찾을 주소)
  output : myUtxos => Dictionary(value : {해당 vout})
********************************************************************************/

Blockchain.prototype.findMyUTXOs = function(address){


  var myUtxos = { };
  var AllUTXO = { };
  AllUTXO = this.findAllUTXOs();


  for(var key in AllUTXO){
//    var parse = JSON.parse(AllUTXO[key][0]);
    for(var i = 0; i < AllUTXO[key].length; i++ ){
      if(address == AllUTXO[key][i]["publicKey"]){
        myUtxos[AllUTXO[key][i]["value"]] = AllUTXO[key][i];
      }
    }
  }
  //console.log(myUtxos);

  return myUtxos;
}



module.exports = Blockchain;