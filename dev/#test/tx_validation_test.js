const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto')

const UTXO = require('../transaction/utxo.js');
const keygen = require('../pki/keygen');
const sign = require('../pki/sign.js');

// test setting
let msg = randomBytes(32);

  // key setting
let privatekey = keygen.getPrivKey();
let publickey = keygen.getPubKey(privatekey);

const sigObj = secp256k1.sign(msg , privatekey);
let signature = sigObj.signature;
let txid = '04'+'test tx id';

  // utxo setting
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

vinelt['sig'] = signature;
testtx.vin.push(vinelt);;

console.log(utxo.isValidTx(testtx))
