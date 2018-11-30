
/*******************************************************************************
filename : networkNode.js
Autor : rach
date : 18. 11. 03
version : v1.0
explanaion :
  - 로컬에서 구현한 결과물을 테스트 할 수 있도록 하는 파일
  - 실제 구현상에 들어가야하는 부분은 아님 !
********************************************************************************/

var rp = require('request-promise');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Blockchain = require('../mine/mine');
var bitcoin = new Blockchain();
var search = require("../search");
var uuid = require('uuid/v1');
var nodeAddress = uuid().split('-').join('');
var port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// 웹 브라우저에 get 방식으로 /blockchain 주소를 입력했을 때 실행

app.get('/blockchain', function(req, res) {
  res.send(bitcoin);
})

// 웹 브라우저에 post 방식으로 /transaction 주소를 입력했을 때 실행
app.post('/transaction', function(req, res) {
  const blockIndex = bitcoin.addNewTransaction(req.body.transaction);
  res.send({note: `트랜잭션은 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
})

app.post('/intelligence', function(req,res) {
  const blockIndex = bitcoin.addNewPost(req.body.post);
  res.send({note: `posts 정보는 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
})

app.get('/mine', function(req, res){
  const newBlock = bitcoin.miningBlock();
  res.json({
    note: "새로운 블락이 성공적으로 만들어 졌습니다.",
    newBlock: newBlock
  })
})

app.listen(port, function() {
  console.log(`listening on port ${port}...`);
})

module.exports = Blockchain;
