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