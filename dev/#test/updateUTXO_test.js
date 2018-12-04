const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto')

const UTXO = require('../transaction/utxo.js');
const keygen = require('../pki/keygen');
const sign = require('../pki/sign.js');

// test setting

  // key setting
let msg = randomBytes(32);
let privatekey = keygen.getPrivKey();
let publickey = keygen.getPubKey(privatekey);

const sigObj = secp256k1.sign(msg , privatekey);
let signature = sigObj.signature;


  // utxo setting
let txid = '04'+'test tx id';
let utxo = new UTXO;
let utxo1 = [{
  "value":10,
  "index":0,
  "publickey":null
}];
utxo1[0]['publickey'] = publickey;
utxo.addNewUTXO(txid, utxo1);

  // tx srtting
let testtx = {
  "txid":'origin',
  "inputCnt":1,
  "vin":[],
  "outputCnt":1,
  "vout":[]
}
let vinelt = {
  "txid":txid,
  "index":0,
}
let voutelt = {
  "value":10,
  "publickey":20,
  "index":0
}
vinelt['sig'] = signature;
voutelt['publickey'] = publickey;
testtx.vin.push(vinelt);
testtx.vout.push(voutelt);

console.log(utxo);
utxo.updateUTXO(testtx);
console.log(utxo);
console.log(utxo.utxopool);
