const { randomBytes } = require('crypto')
const fs = require('fs');
const bs58check = require('bs58check');
const secp256k1 = require('secp256k1');
const sha256 = require('sha256');
let pubkeylist = fs.readFileSync('pubkeylist.json');
pubkeylist = JSON.parse(pubkeylist);

let privkeylist = fs.readFileSync('privkeylist.json');
privkeylist = JSON.parse(privkeylist);

var decodelist = function(list) {
  let result = list.map(x=> {return bs58check.decode(x)} );
  return result;
}

var testVerify = function(publist, privlist) {
  let pub = decodelist(publist);
  let priv = decodelist(privlist);
  let n = pub.length;
  let msg = randomBytes(32);
  let sign;

  for(let i=0; i<n; i++) {
    sign = secp256k1.sign(msg,priv[i]);
    //if (secp256k1.verify(msg,sign,pub[i])==false) return false;
  }
  return true;
}

let result = testVerify(pubkeylist,privkeylist);
console.log(result);
//console.log(priv);
