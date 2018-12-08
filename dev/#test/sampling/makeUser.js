const pki = require('../../pki/keygen');
const bs58check = require('bs58check');
const fs = require('fs');
let getPubKey = pki.getPubKey;
let getPrivKey = pki.getPrivKey;

var getUserPriv = function() {
  let privlist = [];
  let temp;
  for (let i=0; i<1000; i++) {
    temp = getPrivKey();
    privlist.push(bs58check.encode(temp));
  }
  return privlist;
}

var getUserPub = function(privlist) {
  let publist = [];
  let n = privlist.length;
  let temp;
  for (let i=0; i<n ; i++) {
    temp = bs58check.decode(privlist[i]);
    temp = getPubKey(temp);
    publist.push(bs58check.encode(temp));
  }
  return publist;
}

let alist = getUserPriv();
let blist = getUserPub(alist);

let test = JSON.stringify(blist);
fs.writeFileSync('pubkeylist.json',test);

test = JSON.stringify(alist);
fs.writeFileSync('privkeylist.json',test);
