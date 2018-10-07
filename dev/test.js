// blockchain.js 모듈을 이곳에서 가져다 쓰겠다.
const Blockchain = require('./Blockchain')

// 위에서 가져온 모듈의 객체를 만든다.
const bitcoin = new Blockchain();

// 찍어보기
console.log(bitcoin);
