const keygen = require("../dev/pki/keygen");
const sign = require("../dev/pki/sign");
const Blockchain = require("../dev/mine/mine");
const search = require("../dev/search");
var rp = require('request-promise');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const blockchain = new Blockchain();
var uuid = require('uuid/v1');
const bs58check = require('bs58check');
const utxo = require("../dev/transaction/utxo")
var nodeAddress = uuid().split('-').join('');
var port = process.argv[2];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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
    const blockIndex = blockchain.addNewTransaction(req.body);
    res.send({note: `트랜잭션은 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
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

var PrivKey =  keygen.getPrivKey();
var PublicKey = keygen.getPubKey(PrivKey);

console.log(bs58check.encode(PublicKey))
var utxo_pool = new utxo();
utxo_pool = blockchain.findAllUTXOs();

  app.listen(port, function() {


    var working = setInterval(function(){

        //console.log("Current Blockchain => ", blockchain);
        //console.log("test")
        //console.log("PrivKey => ", PrivKey);
      
        var lastBlockIndex = blockchain.getLastBlock().index;
        //console.log("lastBlockIndex => ",lastBlockIndex);


        // Voting_Reward(if문)
        if(lastBlockIndex % 10 == 9){

          blockchain.makeReward(lastBlockIndex-9 , lastBlockIndex);
        }
        console.log(typeof(PublicKey));
        console.log("PublicKey => ", PublicKey);
        encodedPublicKey = bs58check.encode(PublicKey);
        console.log("encodedPublicKey -> " ,encodedPublicKey);
        var NewBlock = blockchain.miningBlock(encodedPublicKey);
        console.log("NewBlock => ", NewBlock["transactionList"]);
        console.log("blockchain.findMyUTXOs(PublicKey) => ", blockchain.findMyUTXOs(encodedPublicKey));

        // 마이닝 완료

        //console.log(NewBlock);
      
        // Broadcast(NewBlock)
        // 
        // Sync는 둘째 문제

    },3000); // Mining Block 간격

    console.log(`listening on port ${port}...`);
  })


module.exports = Blockchain;