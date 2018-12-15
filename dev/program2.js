const keygen = require("../dev/pki/keygen");
const sign = require("../dev/pki/sign");
const Blockchain = require("../dev/mine/mine");
const wallet =  require("../dev/wallet/wallet");
const search = require("../dev/search");
var rp = require('request-promise');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var blockchain = new Blockchain();

var uuid = require('uuid/v1');
const bs58check = require('bs58check');
const utxo = require("../dev/transaction/utxo")
var programUtxo = new utxo(blockchain.findAllUTXOs());

var nodeAddress = uuid().split('-').join('');
var port = process.argv[2];


// app.get
app.get('/blockchain', function(req, res) {
    res.send(blockchain);
  })

// app.post('/',function(req,res))
app.post('/post', function(req,res) {
    const blockIndex = blockchain.addNewPost(req.body);
    res.send({note: `post 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
  })
  
  app.post('/reply', function(req,res) {
    const blockIndex = blockchain.addNewReply(req.body);
    res.send({note: `reply 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
  })
  
  app.post('/vote', function(req,res) {
    const blockIndex = blockchain.addNewVote(req.body);
    res.send({note: `vote 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
  })
  
  app.post('/transaction', function(req, res) {
    
    console.log("req.body =>" , req.body);
    if(programUtxo.isValidTx(req.body)){
      const blockIndex = blockchain.addNewTransaction(req.body);
      res.send({note: `트랜잭션은 ${blockIndex} 블락안으로 들어갈 예정입니다.`});
    }
    else{
      res.send({note: `트랜잭션 데이터 오류`});
    }
  })
  
  app.get('/balance', function(req,res) {
    const peerid = req.query.peerid;
    console.log('req pid', peerid);
    balance = blockchain.findMyUTXOs(peerid);
    console.log("balance = ", balance);
    //const blockchain.findMyUTXOs("");
    res.send(balance);
    
    //const blockIndex = blockchain.addNewPost(req.body);
    //res.send({note: `post 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
  })

/*

블록체인이 수행될 메인 함수 정의

    요구사항

    1. 자동적으로 시간에 맞춰서 마이닝 수행

    2. 일정 시간마다 다른 풀노드와 동기화

    3. 클라이언트 노드의 데이터 요청을 받으면 알맞는 함수 실행

*/
//var utxo_pool = utxo.UTXO();
//console.log("utxo = ",utxo);


/*
// console.log(bs58check.encode(PublicKey))

  app.listen(port, function() {


    var working = setInterval(function(){
        console.log("programUtxo =>", programUtxo);

        //console.log("Current Blockchain => ", blockchain);
        //console.log("test")
        //console.log("PrivKey => ", PrivKey);
      
        var lastBlockIndex = blockchain.getLastBlock().index;
        //console.log("lastBlockIndex => ",lastBlockIndex);


        // Voting_Reward(if문)
        if(lastBlockIndex % 10 == 9){

          blockchain.makeReward(lastBlockIndex-9 , lastBlockIndex);
        }
        // console.log(typeof(PublicKey));
        // console.log("PublicKey => ", PublicKey);
        encodedPublicKey = bs58check.encode(PublicKey);
        encodedPrivateKey = bs58check.encode(PrivKey);

        console.log("encodedPublicKey -> " ,encodedPublicKey);
        var NewBlock = blockchain.miningBlock(encodedPublicKey);
        // console.log("NewBlock => ", NewBlock["transactionList"]);
        console.log("blockchain.findMyUTXOs(PublicKey) => ", blockchain.findMyUTXOs(encodedPublicKey));

        // 마이닝 완료

        //console.log(NewBlock);
      
        // Broadcast(NewBlock)
        // 
        // Sync는 둘째 문제

    },3000); // Mining Block 간격

    console.log(`listening on port ${port}...`);
  })


*/

// var PrivKey =  keygen.getPrivKey();
// var PublicKey = keygen.getPubKey(PrivKey);
// var encodedPublicKey = bs58check.encode(PublicKey);
// console.log("typeof(encodedPublicKey)",typeof(encodedPublicKey) )
// var encodedPrivateKey = bs58check.encode(PrivKey);
// var recvPrivKey = keygen.getPrivKey();
// var recvPublicKey = keygen.getPubKey(recvPrivKey);
// console.log("encodedPublicKey", encodedPublicKey);
// console.log("encodedPrivateKey", encodedPrivateKey)
    
var encodedPrivateKey = "8VaKEbcvN7WjdTbKcWCcxc1AKiL282Ne3n6kmeeoe5ah7vNVA";
var encodedPublicKey = "7yYpwAFSJij7RswzKyDfZxdVt3FZ34iomz4ocY6ViRYDzSohXj";

var PrivKey =  bs58check.decode(encodedPrivateKey);
var PublicKey = bs58check.decode(encodedPublicKey);


var WebSocketServer = require('ws').Server;
  var wss = new WebSocketServer({port: 59200}); 

  var working = setInterval(function(){

    //console.log("Current Blockchain => ", blockchain);
    //console.log("test")
    //console.log("PrivKey => ", PrivKey);
    // programUtxo = blockchain.findAllUTXOs();
    var lastBlockIndex = blockchain.getLastBlock().index;
  
    
    // Voting_Reward(if문)
    if(lastBlockIndex % 10 == 9){
      blockchain.makeReward(lastBlockIndex-9 , lastBlockIndex);
    }
    // console.log(typeof(PublicKey));
    // console.log("PublicKey => ", PublicKey);
    var utxolist = blockchain.findMyUTXOs(encodedPublicKey);
    console.log("utxolist =>", utxolist)
    programUtxo.setUtxoPool(utxolist);

    //var newtransaction = wallet.MakePayment(3, utxolist, recvPublicKey, PrivKey, PublicKey, 1, 1, 0);
    //console.log("newtransaction => ",newtransaction);
    
    //blockchain.addNewTransaction(newtransaction);
    
    var NewBlock = blockchain.miningBlock(encodedPublicKey);
    console.log("NewBlock => ", NewBlock["transactionList"]);

  
    
    
    // 마이닝 완료

    console.log('New Block => ', NewBlock);
  
    // Broadcast(NewBlock)
    // 
    // Sync는 둘째 문제

    },3000);

  wss.on('connection', (conn) => {
    conn.on('message', function(message) {
      let data; 
      //accepting only JSON messages 
      try { 
          data = JSON.parse(message); 
      } catch (e) { 
          console.log("SIG: Invalid JSON"); 
          data = {}; 
      }
          
      //handling function
      switch (data.type) {
        case "post":
          postHandle(conn, data.post);
          break;
        case "vote":
          voteHandle(conn, data.vote);
          break;
        case "reply":
          replyHandle(conn, data.reply);
          break;
        case "transaction":
          transactionHandle(conn, data.transaction);
          break;
        case "balance":
          balanceHandle(conn, data.pid);
          break;
        case "synchronization":
          synchronization(conn, data.pid);
          break;
        case "getblock" :
          getblock(conn, data.pid);
          break;
        

        default:
          console.log("err?");
      }
    });
  });

function balanceHandle(conn, pid){
  // balance
  balanceDictionary = blockchain.findMyUTXOs(pid);
  conn.send(JSON.stringify(balanceDictionary));
}

function postHandle(conn, post) {
  // post
  const blockIndex = blockchain.addNewPost(post);
  conn.send(JSON.stringify({note: `post 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`}));
}

function voteHandle(conn, vote) {
  // vote
  const blockIndex = blockchain.addNewVote(vote);
  conn.send(JSON.stringify({note: `vote 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`}));
}

function replyHandle(conn, reply) {
    //reply
    const blockIndex = blockchain.addNewReply(reply);   
    conn.send(JSON.stringify({note: `reply 정보는 ${blockIndex} 블록 안으로 들어갈 예정입니다.`}));
}





function transactionHandle(conn, transaction) {

  // transaction

  // console.log("transaction =>" , transaction);
  // console.log("transaction.vin => ",transaction["vin"]);
  // console.log("typeof transaction.vin => ",typeof(transaction["vin"]));
  // for(let i = 0; i < transaction["vin"].length; i++){
  //   transaction["vin"][i]["sig"] = bs58check.decode(transaction["vin"][i]["sig"]);
  //   console.log("transaction.vin[i].sig =>", transaction["vin"][i]["sig"] );

  // }
  
  // console.log("")
  
  if(programUtxo.isValidTx(transaction)){
    const blockIndex = blockchain.addNewTransaction(transaction);
    conn.send(JSON.stringify({note: `트랜잭션은 ${blockIndex} 블록 안으로 들어갈 예정입니다.`}));
  }

  else{
    conn.send(JSON.stringify({note: `트랜잭션 데이터 오류`}));
  }

}


