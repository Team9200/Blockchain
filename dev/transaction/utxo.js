// utxopool = {'txid':[voutelt1, voutelt2]}
function UTXO() {
  this.utxopool = {};
}

UTXO.prototype.isValidTx = function (transaction) {
  let vin = transaction['vin'];
  let vout = transaction['vout'];

  if (vin == 'undefined' || vout == 'undefined') return false;
  if (this.isValidVin(vin) == false) return false;
  if (this.compareVinVout(transaction)<0) return false;
  if (this.isVerifiedVin(vin) == false) return false;
  else return true;
};

//-----------------------------------------------------------

function isValidVout(vout) {
  let outpuCnt = voutlist.length;
  for(voutelt in vout) {
    if (isValidVoutElt(voutelt) == false) return false;
    if (voutelt['index'] > outputCnt) return false;
  }
  return true;
}

function isValidVoutElt(voutelt) {
  if(voutelt['value']=='undefined' ||
     voutelt['index']=='undefined' ||
     voutelt['publickey']=='undefined') return false;
  if(bs58check.decode(voutelt['publickey']).length != 33) return false;
  else return true;
}

//-----------------------------------------------------------

UTXO.prototype.isValidVin = function (vin) {
  if (vin.length == 0) return false;
  let isSomeNotValid = vin.every
    (vinelt => {return this.isValidVinElt(vinelt)});
  if (isSomeNotValid == false) return false;
  return true;
};

UTXO.prototype.isValidVinElt = function (vinelt) {
  if (vinelt['txid']  == 'undefined' ||
      vinelt['index'] == 'undefined' ||
      vinelt['sig']   == 'undefned') return false;
  if (vinelt['txid'].substring(0,2) != '04') return false;
  if (vinelt['sig'].length != 64) return false;

  if (this.isUTXO(vinelt['txid'], vinelt['index']) == false) return false;
  else return true;
};

UTXO.prototype.isUTXO = function (txid, outindex) {
  if(this.utxopool[txid] == 'undefined') return false;
  if(this.utxopool[txid].map(x=>x.index).indexOf(outindex) == -1) return false;
  return true;
};

//-----------------------------------------------------------

UTXO.prototype.compareVinVout = function (transaction) {
  let vin = transaction['vin'];
  let vout = transaction['vout'];
  return sumVoutValue(vout)-this.sumVinValue(vin);
};

UTXO.prototype.sumVinValue = function (vin) {
  let result = 0;
  for (let vinelt in vin)
    result += vinelt['value'];
  return result;
};

function sumVoutValue(vout) {
  let result = 0;
  for (voutelt in vout)
    result += voutelt['value'];
  return result;
}

//-----------------------------------------------------------

UTXO.prototype.isVerifiedVinElt = function (vinelt) {
  let msg = Buffer.from(vinelt['txid'].slice(0,32));
  let sig = vinelt['sig'];
  let publickey = bs58check.decode(utxo['publickey']);
  return secp256k1.verify(msg,sig,publickey);
};

UTXO.prototype.isVerifiedVin = function (vin) {
  let isSomeNotVerified = vin.every
    (vinelt => {return this.isValidVinElt(vinelt)});
  return true;
};

//-----------------------------------------------------------

UTXO.prototype.updateUTXO = function (transaction) {
  let txid = transaction['txid'];
  let vin = transaction['vin'];
  let vout = transaction['vout'];
  for (let i in vin)
    this.deleteSpentUTXO(vin[i]);
  this.addNewUTXO(txid, vout);
  return;
};

UTXO.prototype.deleteSpentUTXO = function (vinelt) {
  let spentid = vinelt['txid'];
  let spentutxo = this.utxopool[spentid];
  let spentindex = spentutxo.findIndex(function(element) {
    return element['index']==vinelt['index'];
  });
  spentutxo.splice(spentindex,1);

  if (spentutxo.length == 0) delete this.utxopool[spentid];
  else this.utxopool[spentid] = spentutxo;

  return spentutxo[spentindex];
};

UTXO.prototype.addNewUTXO = function (txid, vout) {
  this.utxopool[txid] = vout;
};

//-----------------------------------------------------------

UTXO.prototype.getIDList = function () {
  let idlist = Object.keys(utxopool);
  idlist.sort();
  return idlist;
};

module.exports = UTXO;
