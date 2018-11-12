const secp256k1 = require('secp256k1')
const bs58check = require('bs58check');

/*******************************************************************************
  function : signTransaction
  explanaion : 트랜잭션 아이디(트랜잭션의 해쉬의 앞에서 부터 절반 자른값)을 개인키로
              서명하는 함수
  input : transaction(json), privkey(buffer array)
  output : signiture(buffer array)
********************************************************************************/

function signTransaction(transaction, privatekey) {
  let msg = Buffer.from(transaction[tx_id].slice(0,32));
  let sign = secp256k1.sign(msg, privatekey);
  return sign.signature;
}

module.exports = signTransaction;
