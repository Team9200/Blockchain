// blockchain.js 모듈을 이곳에서 가져다 쓰겠다.
const Blockchain = require('./Blockchain')

const bitcoin = new Blockchain();

console.log(bitcoin);
/*
const previousBlockHash = "abasdsad";
const currentBlockData = [
  {
    amount: 10,
    sender: 'prc',
    recipient: 'hong'
  },
  {
    amount: 10,
    sender: 'hong',
    recipient: 'namse'
  },
  {
    amount: 200,
    sender: 'linear',
    recipient: 'jin'
  }
];

//console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 127885));
*/
