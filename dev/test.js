// blockchain.js 모듈을 이곳에서 가져다 쓰겠다.
const Blockchain = require('./Blockchain')

// 위에서 가져온 모듈의 객체를 만든다.
const bitcoin = new Blockchain();

// 새로운 블락 만들기
bitcoin.createNewBlock(1111,'aaaaaa', '1a2a3a4a5a6a');

// 새로운 트랜잭션 생성
bitcoin.createNewTransaction(100,'PRC','Linear');

// 새로운 블락 생성
bitcoin.createNewBlock(2222, 'bbbbbb', '2b2b2b2b2b2b');

// pending newTransactions
bitcoin.createNewTransaction(200,'rqwewe','qwewqe');
bitcoin.createNewTransaction(300,'asdasdsd','123213');

// 새로운 블락 생성2

bitcoin.createNewBlock(333, 'asdasdsad', 'wewewenewhash');
// 찍어보기
console.log(bitcoin.chain[2]);
