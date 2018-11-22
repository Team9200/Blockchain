var Blockchain = require('./blockchain');

/*******************************************************************************
  function : searchInBlock
  explanaion : 블록 내부 정보를 조회하는 메소드
  input : key, value
  output : 해당하는 malware의 모든 정보를 반환
********************************************************************************/

Blockchain.prototype.searchInBlock = function (key, value) {
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




  include = function(arr, obj) {
    for(var i=0; i<arr.length; i++) {
      if (arr[i] == obj) return true;
    }
  }

 

/*******************************************************************************
  function : findAllUTXOs
  explanaion : 블록 내부의 Trnasaction들을 조회해서 UTXO를 담고 있는 txid를 key로 갖고, tx의 전체 JSON을  해당 트랜잭션의
  UTXO들의 index를 담은 배열을 value로 갖는 Dictionary를 return한다.

  input : 없음
  output : Dictionary(transaction : UTXOindex[])
********************************************************************************/

Blockchain.prototype.findAllUTXOs = function(){
  var UTXO_dict = {};

  // 전체 블록 길이만큼 탐색
  for(var i = 0; i < this.chain.length; i ++){

    //현재 블록의 트랜잭션 수를 cnt라는 변수에 저장
    var cnt = this.chain[i].transactionList.length;
    console.log("cnt = ",cnt);
    console.log("transactionList = ", this.chain[i].transactionList);
    console.log("chain.length = ",this.chain.length)

    if (cnt == 0)
      continue;
    
    else {
      // 현재 블록 내부의 트랜잭션 수(cnt) 만큼 반복문 실행
      for (var j = 0; j < cnt; j++){
        
        t_tx = this.chain[i].transactionList[j];
        console.log("t_tx = ", t_tx);
        t_input_cnt = t_tx["inputCnt"];
        console.log("t_input_cnt = ",t_input_cnt);
        t_txid = t_tx["txid"];
        console.log("t_txid = ",t_txid);
        t_vin = t_tx["vin"];
        console.log("t_vin = ",t_vin);
        //inputCnt만큼 for문을 돌면서 vin에서 각 index마다 참조하는 transaction과 해당 index를 UTXOdict에서 찾는다.
        for (var k = 0; k < t_input_cnt; k++){
          console.log("k = ",k);       
          reference_txid = t_tx["vin"][k]["txid"];
          console.log("reference_txid = ",reference_txid);
          // 현재 UTXOdict에 존재한다면 UTXOindex[]에 해당 index를 삭제한다.
          for(var key in UTXO_dict){
            console.log("key =", key);
            console.log("key[k][\"txid\"] = ", key);
            console.log("include(UTXO_dict[key],t_vin[k][\"index\"]) = ", include(UTXO_dict[key],t_vin[k]["index"]));

            if (key== reference_txid && include(UTXO_dict[key],t_vin[k]["index"])){
              console.log("UTXO_dict[key][0] =>",UTXO_dict[key][0]);
              console.log("UTXO_dict[key] =>", JSON.parse(UTXO_dict[key][0]));
              //console.log("UTXO_dict[key][0] =>", JSON.parse(UTXO_dict[key][0])[0]);
              //console.log("JSON.parse(UTXO_dict[key][0])) =>", JSON.parse(UTXO_dict[key][0])[0]);
              console.log("UTXO_dict[key][0][\"txid\"] =>", JSON.parse(UTXO_dict[key][0])["txid"]);
              //console.log("JSON.parse(UTXO_dict[key][0])[\"vin\"][k][\"txid\"] = ",JSON.parse(UTXO_dict[key][0])["vin"][k]["txid"]);
              //console.log("UTXO_dict[key].indexOf(t_vin[k][\"index\"]) => ",UTXO_dict[key].indexOf(t_vin[k]["index"]) );
              //console.log("t_vin[k][\"index\"] => ",t_vin[k]["index"])
              //console.log("UTXO_dict[key].indexOf(0) ==>", UTXO_dict[key].indexOf(0));
              //console.log("Before Splice UTXO_dict[key].length ==>",UTXO_dict[key].length);              
              UTXO_dict[key].splice((UTXO_dict[key].indexOf(t_vin[k]["index"])),1);
              console.log("After Splice ==>",UTXO_dict[key]);
              console.log("After Splice UTXO_dict[key].length ==>",UTXO_dict[key].length);
              
              // UTXOindex[]의 길이가 1이면 dictionary에서 해당 tx를 삭제한다.
              if(UTXO_dict[key].length == 1){
                delete UTXO_dict[key];
                console.log("After delete, UTXO_dict ==>", UTXO_dict);
              }
            }
          }
        }
        
        //outputCnt를 구하고 transaction과 UTXOindex[]를 UTXO_dict에 추가한다.
        t_output_cnt = t_tx["outputCnt"];
        t_vout = t_tx["vout"];
        console.log("t_vout = ", t_vout);
        temp_array = [];
        //temp_array[0] = {};
        //temp_array[0] = t_tx;
        temp_array[0] = JSON.stringify(t_tx);

        for(var k = 0; k < t_output_cnt; k++){
          temp_array.push(k);
        }
        console.log("temp_array = " , temp_array);
        console.log("JSON.stringify(t_tx) = ",JSON.stringify(t_tx));
        console.log("JSON.parse(JSON.stringify(t_tx)) = ",JSON.parse(JSON.stringify(t_tx)));
        console.log("test 1 = ",JSON.stringify(t_tx) == JSON.stringify(temp_array[0]))
        console.log("test 2 = ",t_tx ==temp_array[0]);
        
        UTXO_dict[t_tx["txid"]] = temp_array;
        console.log("UTXO_dict = ", UTXO_dict);
      }
    }
  }

  return UTXO_dict;
}




/*******************************************************************************
  function : findMyUTXOs
  explanaion : 블록 내부의 Trnasaction들을 조회해서 UTXO를 담고 있는 txid를 key로 갖고, tx의 전체 JSON을  해당 트랜잭션의
  UTXO들의 index를 담은 배열을 value로 갖는 Dictionary를 return한다.

  input : address (UTXO를 찾을 주소)
  output : myUtxos => Dictionary(value : JSON.stringify(transaction))
********************************************************************************/

Blockchain.prototype.findMyUTXOs = function(address){
  

  var myUtxos = { };
  var AllUTXO = { };
  AllUTXO = this.findAllUTXOs();


  for(var key in AllUTXO){
    var parse = JSON.parse(AllUTXO[key][0]);

    
    for(var i = 0; i < parse["outputCnt"]; i++ ){
      //console.log("parse[\"out\"][0]", parse["vout"][i]["publicKey"]);
      if(address == parse["vout"][i]["publicKey"] && include(AllUTXO[key],i)){
        myUtxos[parse["vout"][i]["value"]] = JSON.stringify(parse);
      }
    }
  }
  //console.log(myUtxos);

  return myUtxos;
}


/*******************************************************************************
  function : MakePayment
  explanaion : 지불할 돈(amount) 만큼 나의 UTXO를 조회해서 거래를 만드는 함수

  input : receiver,sender,amout
  output : 생성된 transaction의 Json 형태의 출력
********************************************************************************/


Blockchain.prototype.MakePayment = function (amount, receiver_publickey, sender_privatekey, sender_publickey, t_version){
  
  var myVin = [];
  console.log("input = " , amount, receiver_publickey, sender_privatekey, sender_publickey, t_version);
  var t_MyUtxos = {};
  t_MyUtxos = this.findMyUTXOs(sender_publickey);

  console.log(t_MyUtxos)

  var mySum = 0;
  var i = 0;

  // Key 개수 만큼 MyUTXO를 순회한다.
  for(var key in t_MyUtxos){
    console.log("key ==> ",key)
    
    // 현재 자산의 누적 합보다 보내야 할 금액이 더 크면 누적합에 UTXO를 계속 추가하며 누적 합을 키운다.
    // 결과적으로 vin에 사용할 UTXO 만큼 추가하여 vin을 생성한다. 
    if(amount > mySum){
      mySum = parseInt(key) + parseInt(mySum);
      console.log("mySum ==>", mySum)
      myVin[i] = new Object;
      console.log("JSON.parse(t_MyUtxos[key][0]) => ",JSON.parse(t_MyUtxos[key]));
      myVin[i]["txid"] = JSON.parse(t_MyUtxos[key])["txid"];
      
      for(var j = 0; j < JSON.parse(t_MyUtxos[key])["outputCnt"]; j++){
        console.log("JSON.parse(t_MyUtxos[key])[\"vout\"][j][\"publicKey\"] =>",JSON.parse(t_MyUtxos[key])["vout"][j]["publicKey"]) 
        if(JSON.parse(t_MyUtxos[key])["vout"][j]["publicKey"] == sender_publickey){
          console.log("JSON.parse(t_MyUtxos[key][0])[\"vout\"][j][\"publicKey\"] =>" ,JSON.parse(t_MyUtxos[key])["vout"][j]["publicKey"]);
          myVin[i]["index"] = JSON.parse(t_MyUtxos[key])["vout"][j]["index"];
        }
      }
      // 서명 미구현
      myVin[i]["sig"] = "sig(private_key, JSON.parse(t_MyUtxos[key][0])[\"txid\"])";  
      i++;
    }
    
  }

  console.log("myVin =>", myVin);
  console.log("mySum => ", mySum);
  

  // UTXO를 다 돌고 돈이 부족하면 false 리턴
  if(amount > mySum){
    console.log("Not enough money");
    return false;
  }

  // 일단 최대 받는사람 1명 + 나에게 잔돈 전송까지 구현
  var myVout = []; 
  myVout[0] = new Object;
  myVout[0]["value"] = amount;
  myVout[0]["index"] = 0;
  myVout[0]["publicKey"] = receiver_publickey;
  
  var t_outputCnt = 1;

  if(amount<mySum){
    myVout[1] = new Object;
    myVout[1]["value"] = mySum - amount;
    myVout[1]["index"] = 1;
    myVout[1]["publicKey"] = sender_publickey;
    t_outputCnt = 2;
  }
  console.log("myVout =>", myVout);

  // 새 트랜잭션 정의
  const newTransaction= {
    version : t_version,
    inputCnt : i,
    vin : myVin,
    outputCnt : t_outputCnt,
    vout : myVout
  };
  
  console.log("newTransaction = ", newTransaction);

  // 새 트랜잭션에 추가
  this.addNewTransaction(newTransaction);

  return newTransaction;

}










module.exports = Blockchain;
