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
          var n_vout = this.chain[i].transactionList[j]["outputCnt"];
          console.log("tx_info",this.chain[i].transactionList[j]);
          console.log("vout_ctr",n_vout);
          console.log("vout_info",this.chain[i].transactionList[j]["vout"]);

          // 출력 수(outpuCnt)만큼 출력(vout)을 돌면서 pubkey를 비교함
          for(jj = 0; jj < n_vout; jj++){
            console.log("this transaction's publicKey = ",this.chain[i].transactionList[j]["vout"][jj]["publicKey"])
            if(this.chain[i].transactionList[j]["vout"][jj]["publicKey"]==p_key){
              var t_txid = this.chain[i].transactionList[jj]["txid"];
              console.log("find transaction, check it's UTXO...: ",t_txid);
              find_Flag = 0; // 찾으면 1로 바꿔서 빠져나감

              // pubkey를 출력으로 갖는 트랜잭션을 찾았으면, 이후 블록부터 해당 트랜잭션의 id가 vin에 들어있는지 확인함
              for(k = i; k < this.chain.length; k++){
                var tx_len = this.chain[k].transactionList.length;
                console.log("tx_len = ",tx_len);
                console.log("k_transactionList = ", this.chain[k].transactionList);

                // 동일하게 트랜잭션 리스트의 길이만큼 반복문 또 실행
                for(kk = 0; kk < tx_len; kk++){
                  if(this.chain[k].transactionList[kk]["vin"]["txid"]==t_txid){
                    console.log(t_txid ,"(txid) is not UTXO");
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