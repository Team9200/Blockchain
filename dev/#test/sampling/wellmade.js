const sha256 = require('sha256');
const fs = require('fs');
const bs58check = require('bs58check');

const getTimeStamp = require('../../util/getTimeStamp.js');
const { signPost, signVote } = require('../../pki/sign.js');
const { readChain, writeChain, readList} = require('../../util/readWriteChain.js');
const { getRandomInt,
  getUserPublic, getUserPrivate } = require('./get');

/* functions to add new good post */

 var getPostBody = function(usernumber, malwarenumber, description) {
   let filename = './malwareslist.json';
   let malwareslist = fs.readFileSync(filename)
   malwareslist = JSON.parse(malwareslist);

   let body = malwareslist[malwarenumber];
   body['analyzer'] = getUserPublic(usernumber);
   body['collector'] = getUserPublic(getRandomInt(1000));
   body['description'] = description;
   return body;
 }

 var getUserPost = function(usernumber, malwaresnumber, title, description) {
   let body = getPostBody(usernumber, malwaresnumber, description);
   let hashtag = ['well-done', 'analyzed', 'gosu'];
   let publickey = getUserPublic(usernumber);
   let post = {
     'title':title,
     'timestamp':getTimeStamp(),
     'body':body,
     'hashtag':hashtag,
     'publickey':publickey,
   }
   post['permlink'] = '01' + sha256(JSON.stringify(post));

   let privatekey = bs58check.decode(getUserPrivate(usernumber));
   let sign = signPost(post, privatekey);
   post['sign'] = sign;
   return post;
 };

 var getGoodPost = function(usernumber, malwaresnumber, filename) {
   let directory = './goodposts/' + filename;
   let description = fs.readFileSync(directory, 'utf8');
   let post = getUserPost(usernumber, malwaresnumber, 'report of' + filename, description);
   return post;
 }

/* functions for testing */

 var initGoodPost = function() {
   let filename = 'Trojan.Android.KRBanker.md';
   let usernumber = 11;
   let idx = 171;
   let post = getGoodPost(usernumber, 171, filename);

   let list = [];
   list.push(post);
   list = JSON.stringify(list);
   fs.writeFileSync('goodpostlist.json', list);
 }

 var updateGoodPost = function(post) {
   let list = readList('./goodpostlist.json');
   list.push(post);
   list = JSON.stringify(list);
   fs.writeFileSync('goodpostlist.json', list);
 }

 var showGoodPost = function() {
   let show = readList('./goodpostlist.json');
   console.log(show);
 }

 var getGoodPostList = function() {
   let goodlist = readList('./goodpostlist.json');
   return goodlist;
 }

 var getGoodPostLink = function() {
   let list = getGoodPostList();
   let link = list.map(x=> x['permlink']);
   return link;
 };

/* HOW TO SET */

/*
0) init
initGoodPost => showGoodPost

1) add
getGoodPost => updateGoodPost => showGoodPost
*/

/*
let filename = '한글 문서에 포함된 매크로 악성코드 분석.md'
let post = getGoodPost(12, 787, filename);
updateGoodPost(post);
showGoodPost();
*/

/*
userlist:
11 : ESTsecurity
12 : INCA

malist:
171 Trojan.Android.KRBanker by 11
328 Trojan.Ransom.CryptoJoker by 11
551 POS 시스템을 노린 악성코드 by 12
597 경고 메시지 없이 실행되는 MS 워드 비디오 삽입 취약점 주의 by 12
613 과거 리눅스 커널 취약점 활용한 악성파일 유포 주의.md by 12
34 사용자 PC 정보를 탈취하는 악성코드 감염 주의.md by 12
443 음란물 사이트를 통해 유포하는 협박성 악성코드 감염 주의 by 12
787 한글 문서에 포함된 매크로 악성코드 분석 by 12

*/

module.exports ={
  getGoodPostList: getGoodPostList,
  getGoodPostLink: getGoodPostLink
}
