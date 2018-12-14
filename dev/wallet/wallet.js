const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');
const ripemd160 = require('ripemd160');
const sha256 = require('sha256');
const blockchain = require('../mine/mine');
const program = require("../program");

const {} = require('../search');


/*******************************************************************************
  function: P2PrequestTX
  explanaion: 전달 받은 address의 모든 거래 내역을 반환하도록 요청
  input : address
  output: 전달 받은 address 가 관련된 모든 transaction 들의 리스트
*******************************************************************************/

function P2PrequestTX(address) {};

/*******************************************************************************
  function: P2PrequestUTXO
  explanaion: 지갑 사용자의 모든 UTXO를 얻어오는 함수
  input : User의 publickey
  output: 지갑 사용자의 모든 UTXO
*******************************************************************************/

function P2PrequestUTXO(address) {};

/*******************************************************************************
  function: getTotalAmount
  explanaion: utxolist로 부터 사용자가 가지고 있는 돈을 가져옴
  input : 사용자의 utxolist
  output: float 형의 잔액
*******************************************************************************/

function getTotalAmount(utxolist) {};

/*******************************************************************************
  function: getSendList
  explanaion: 출금 내역 출력
  input :
  output:
*******************************************************************************/

function getSendList(txlist) {};

/*******************************************************************************
  function: getReceviceList
  explanaion: 입금 내역
  input :
  output:
*******************************************************************************/

function getReceviceList(txlist) {};


/*******************************************************************************
  function : MakePayment
  explanaion : 지불할 돈(amount) 만큼 나의 UTXO를 조회해서 거래를 만드는 함수

  input : receiver,sender,amout
  output : 생성된 transaction의 Json 형태의 출력
********************************************************************************/

function MakePayment(amount, receiver_publickey, sender_privatekey, sender_publickey, t_version){
  
  var myVin = [];
  var t_MyUtxos = {};
  
  t_MyUtxos = program.findMyUTXOs(sender_publickey);
  console.log("sender_publickey =>", sender_publickey);
  console.log("t_MyUtxos",t_MyUtxos);

  var mySum = 0;
  var i = 0;

  // Key 개수 만큼 MyUTXO를 순회한다.
  //  key = txid,  t_MyUtxos[key] = vout, t_MyUtxos[key]["value"] = value;
  for(var key in t_MyUtxos){
    
    // 현재 자산의 누적 합보다 보내야 할 금액이 더 크면 누적합에 UTXO를 계속 추가하며 누적 합을 키운다.
    // 결과적으로 vin에 사용할 UTXO 만큼 추가하여 vin을 생성한다. 
    if(amount > mySum){
      mySum = parseInt(t_MyUtxos[key]["value"]) + parseInt(mySum);
      myVin[i] = new Object;

      console.log("key => ",key);
      myVin[i]["txid"] = JSON.parse(key);
      
      for(var j = 0; j < JSON.parse(t_MyUtxos[key])["outputCnt"]; j++){
        if(JSON.parse(t_MyUtxos[key])["vout"][j]["publicKey"] == sender_publickey){
          myVin[i]["index"] = JSON.parse(t_MyUtxos[key])["vout"][j]["index"];
        }
      }
      // 서명 미구현
      myVin[i]["sig"] = "sig(private_key, JSON.parse(t_MyUtxos[key][0])[\"txid\"])";  
      i++;
    }
    
  }


  // UTXO를 다 돌고 돈이 부족하면 false 리턴
  if(amount > mySum){
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

  // 새 트랜잭션 정의
  const newTransaction= {
    version : t_version,
    inputCnt : i,
    vin : myVin,
    outputCnt : t_outputCnt,
    vout : myVout
  };
  

  // 새 트랜잭션에 추가
  this.addNewTransaction(newTransaction);

  return newTransaction;

}

module.exports = {
  getWalletAddress: getWalletAddress,
  MakePayment : MakePayment
};