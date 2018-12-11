var Blockchain = require('./mine/mine.js');
const sha256 = require('sha256');

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



/*******************************************************************************
  function : makeReward
  explanaion :

  input : 보상에 담을 블록의 시작 블록(start),  끝 블록(end)
  output :
********************************************************************************/

Blockchain.prototype.makeReward = function(start, end){


  // 블록 start ~ end 까지 모든 Post, Reply, Vote를 통해 Reward를 산출함.



  /*
  기존에 있었던 모든 Permlink
  findAllPermlink(start) return Block[0] to Block[start-1], All Permlink and Weight
    {
      Permlink : {
                    Writer's PublicKey : 0 ,
                    Voter1's PublicKey : Weight,
                    Voter2's PublicKey : Weight,
                    ...
                  }
    }
  */

  var allPermlink = {};
  allPermlink = this.findAllPermlink(start);


  // 이 구간 안에 수집된 새로운 Weight
  var newWeightDict = {};
  newWeightDict = this.getWeight(start, end, allPermlink);
  console.log("newWeightDict => ",newWeightDict);
  // newWeightDict = { Permlink : weight, ...  } ;





  // 이 구간안의 모든 Weight 를 구함
  // findTotalWeight()
  var totalweight = this.findTotalWeight(newWeightDict);
  console.log("totalweight => ",totalweight);
  console.log("this.totalWeight => ",this.totalWeight);



  // weightDict의 길이만큼 반복하면서 Permlink마다 줄 Value를 구함...
  // Value의 전체 합은 고정값 (100)
  var rewardLimit = 100;
  var permRewardDict = {};
  permRewardDict = this.makePermlinkReward(newWeightDict, totalweight, rewardLimit);
  console.log("11 permRewardDict =>", permRewardDict);
  /*
    {
      Permlink1 : value,
      Permlink2 : value,
      ...
    }
  */


  // Transaction 생성
  RewardTransaction = this.RewardTransaction(permRewardDict, allPermlink);
  console.log("RewardTransaction =>", RewardTransaction);

  return true;
}





Blockchain.prototype.findAllPermlink = function(start) {

  var PermlinkDict = {};


  // 처음 블록부터 start 이전 블록까지 탐색 진행
  for(var i = 0; i< start; i++){

    nowBlock = this.chain[i];
    // 현재 블록의 Post, Vote, Reply 수 변수에 저장
    var postCnt = nowBlock.postList.length;
    var replyCnt = nowBlock.replyList.length;
    var voteCnt = nowBlock.voteList.length;
    console.log("postCnt => ", postCnt , "replyCnt => ", replyCnt, "voteCnt =>", voteCnt);


    // 현재 블록에 아무 Post, Vote, Reply도 없을 경우, 다음 블록으로 이동
    if (postCnt == 0 && replyCnt == 0 && voteCnt ==0)
      continue;


    // 현재 블록에 Post | Vote | Reply 가 존재할 경우, else문 진행
    else {

      // 현재 블록의 Postlist의 길이가 0이 아닌 경우, Dict에 추가
      if(postCnt != 0){

        // 현재 블록 내부의 Post 수 (postCnt) 만큼 반복문 실행
        for(var j = 0; j < postCnt; j++){
          tPost = nowBlock.postList[j];
          tWriter = tPost["publickey"];
          tPermlink = tPost["permlink"];
          PermlinkDict[tPermlink] = {};

          // 이 Post의 Writer의 Weight = 0 으로 처음 등록함
          PermlinkDict[tPermlink][tWriter] = 0;
        }
      }

      // 현재 블록의 Replylist의 길이가 0이 아닌 경우, Dict에 추가
      if(replyCnt != 0){

        // 현재 블록 내부의 Reply 수 (replyCnt) 만큼 반복문 실행
        for(var j = 0; j < replyCnt; j++){
          tReply = nowBlock.replyList[j];
          tWriter = tReply["publickey"];
          tPermlink = tPost["permlink"];
          PermlinkDict[tPermlink] = {};

          // 이 Reply의 Writer의 Weight = 0 으로 처음 등록함
          PermlinkDict[tPermlink][tWriter] = 0;
        }
      }//end if

      // 현재 블록의 Votelist의 길이가 0이 아닌 경우, Dict에 추가
      if(voteCnt != 0){

      // 현재 블록 내부의 Post 수 (cnt) 만큼 반복문 실행
        for(var j = 0; j < voteCnt; j++){
          tVote = nowBlock.voteList[j];
          tVoter = tVote["publickey"];
          tRefpermlink = tVote["refpermlink"];
          tWeight = tVote["weight"];

          // 이 Voter의 Weight = tWeight 으로 기존 Permlink에 등록함
          PermlinkDict[tRefpermlink][tVoter] = tWeight;
        }
      }//end if

    }// End else
  }// End for(i)


  return PermlinkDict;
}// End Function






Blockchain.prototype.getWeight = function(start, end, AllPermLink){

  // Weight를 담을 Dictionary를 선언
  WeightDict = {}
  console.log("AllPermLink =>", AllPermLink);
  for(var i = start; i<end; i++){

    // 현재 블록을 nowBlock으로 저장
    nowBlock = this.chain[i];

    var voteCnt = nowBlock.voteList.length;
    console.log("nowBlock.voteList => ",nowBlock.voteList)
    console.log("voteCnt =>", voteCnt);

    // 현재 블록에 Vote가 없을 경우 다음 블록으로 이동
    if(voteCnt == 0)
      continue;

    // 현재 블록에 Vote가 있는 경우
    else{

      for(var j = 0; j < voteCnt; j++){
        tVote = nowBlock.voteList[j];
        tRefpermlink = tVote["refpermlink"];
        tWeight = tVote["weight"];

        // 이미 tRefpermlink가 WeightDict에 존재한다면 값을 더해준다.
        if(!(tRefpermlink in AllPermLink))
          continue;

        if(tRefpermlink in WeightDict){
          WeightDict[tRefpermlink] = WeightDict[tRefpermlink] + tWeight;
        }

        // 없을 경우 tWeight로 등록 및 초기화
        else{
          WeightDict[tRefpermlink] = tWeight;
        }
      }//end for(j)

    }// end else
  }// end for(i)

  // WeightDict을 리턴
  console.log("WeightDict => ", WeightDict);
  return WeightDict;
}// End function


Blockchain.prototype.findTotalWeight =  function(WeightDict){


  sumValues = 0;
  for (var key in WeightDict) {
    sumValues = WeightDict[key] + sumValues;

  }
  console.log("sumValues =>", sumValues);
  return sumValues;
}



Blockchain.prototype.makePermlinkReward = function(WeightDict, TotalWeight, rewardLimit){

  PermlinkRewardDict = {};


  /*
  const object = WeightDict;

  for(const [key, value] of Object.entries(object)) {

    console.log(key, value);
    PermlinkRewardDict[key] = (value / TotalWeight) * rewardLimit;
  }
  */

  for (var key in WeightDict) {
    console.log("key => ",key)
    // check if the property/key is defined in the object itself, not in parent
    if (WeightDict.hasOwnProperty(key)) {
      PermlinkRewardDict[key] = (WeightDict[key] / TotalWeight) * rewardLimit;
      console.log("PermlinkRewardDict[key] => ", PermlinkRewardDict[key]);
      console.log("WeightDict[key] => ",WeightDict[key] ," TotalWeight =>", TotalWeight,"rewardLimit", rewardLimit);
    }
  }


  return PermlinkRewardDict;
}




Blockchain.prototype.RewardTransaction = function(PermRewardDict, AllPermlink){

  console.log("PermRewardDict =>", PermRewardDict);
  //for(const [key, value] of Object.entries(PermRewardDict)){
  for (var key in PermRewardDict) {

    value = PermRewardDict[key];
    console.log("PermRewardDict[key] => ",value)
    var newtransaction  = {};
    newtransaction["version"] = 0.1;
    newtransaction["inputCnt"] = 1;

    // input에는 그냥 Permlink만 들어감
    vin = [];
    vin[0] = new Object;
    vin[0]["txid"] = key;
    newtransaction["vin"] = vin;
    newOutputCnt = 0;
    vout = [];

    totalWeight = this.findTotalWeight(AllPermlink[key]);
    console.log("RewardTransaction @ totalWeight => ", totalWeight);
    console.log("RewardTransaction @ AllPermlink[key] => ", AllPermlink[key]);

    // 보상을 줘야 하는데, Vote는 없고 Post만 있는 경우
    if(totalWeight==0){
      console.log("if value =>", value);


      //for(const[aKey, aValue] of Object.entries(AllPermlink[key])){
      for (var aKey in AllPermlink[key]) {
        console.log("aKey =>", aKey);

        aValue = AllPermlink[key][aKey];
        console.log("aValue =>", aValue);

        // 현재 Vote가 하나도 없는 경우 Post의 Writer만 모든 보상을 가져갈 수 있다?
        if(totalWeight==0){
          vout[0] = new Object;
          vout[0]["value"] = value;
          vout[0]["index"] = 0;
          vout[0]["publicKey"] = aKey;
        }
        console.log("vout => ", vout);
        break;
      }
    } // end if




    else{
      // 각 Weight 별로 Pubket에 맞는 Output 생성함
      //for(const[aKey, aValue] of Object.entries(AllPermlink[key])){

      for (var aKey in AllPermlink[key]) {

        AllPermlink[key][aKey] = aValue
        console.log("else aValue =>", aValue);

        // 0번째는 Writer의 보상이므로 전체 value에서 1/2 한 값 만큼 가져감
        if(newOutputCnt==0){
          vout[newOutputCnt] = new Object;
          vout[newOutputCnt]["value"] = value/2;
          vout[newOutputCnt]["index"] = 0;
          vout[newOutputCnt]["publicKey"] = AllPermlink[key][aKey];
          newOutputCnt++;
        }// end if

        // 다른 Voter들은 전체 value에서 1/2 한 값 만큼에서 자신의 weight/ TotalWeight 만큼 가져감
        else{
          vout[newOutputCnt] = new Object;
          vout[newOutputCnt]["value"] = (value/2) * (aValue/totalWeight) ;
          vout[newOutputCnt]["index"] = newOutputCnt;
          vout[newOutputCnt]["publicKey"] = AllPermlink[key][aKey];
          newOutputCnt++;
        }//end else

      }// enf for
    }// end else

    newtransaction["outputCnt"] = newOutputCnt;
    newtransaction["vout"] = vout;
    newtransaction["txid"] =  "04" + sha256(JSON.stringify(newtransaction)),
    console.log("newTransaction => ", newtransaction);
    this.pendingTransactions.push(newtransaction);
  }


  return true;
}


module.exports = Blockchain;
