var express = require('express'),
var app = express();
var bodyParser = require('body-parser');
var Blockchain = require('./blockchain');
var bitcoin = new Blockchain();
var uuid = require('uuid/v1');
var nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// 웹 브라우저에 get 방식으로 /blockchain 주소를 입력했을 때 실행

app.get('/blockchain', function(req, res) {
  res.send(bitcoin);
})

// 웹 브라우저에 post 방식으로 /transaction 주소를 입력했을 때 실행
app.post('/transaction', function(req, res) {
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.send({note: `트랜잭션은 ${blockIndex} 블락안으로 들어갈 예정입니다.`})
})

app.get('/mine', function(req, res){
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];

  const currentBlockData = {
    transaction:bitcoin.pendingTransactions,
    index:lastBlock['index']+1
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

  //채굴에 대한 보상
  bitcoin.createNewTransaction(10, "bosang0000",nodeAddress);
  const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);

  res.json({
    note: "새로운 블락이 성공적으로 만들어 졌습니다.",
    newBlock: newBlock
  })
})

app.listen(3000, function() {
  console.log('listening on port 3000');
})
