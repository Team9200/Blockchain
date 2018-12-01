var Blockchain = require('./blockchain');



Blockchain.prototype.getMyBlockinfo = function () {

    chainInfo = {};
    
    var t_length = this.chain.length;

    var last_block_hash = this.chain[t_length-1]["hash"];
    chainInfo["length"] = t_length;
    chainInfo["lastBlockhash"] = last_block_hash;

    return chainInfo;

};
    


Blockchain.prototype.blockRequest = function () {

    var t_length = this.chain.length;


};

Blockchain.prototype.blockSend = function (blockIndex) {



};


Blockchain.prototype.blockSync = function (){
    t_MyBlockinfo = {};
    t_MyBlockinfo = this.getMyBlockinfo();

    //getBlock 다른 블록 정보 요청함
    t_OtherBlockinfo = {};

    t_OtherBlockinfo = this.blockRequest();

    flag = 0;
    for(var i = t_MyBlockinfo["length"];i>0;i--){
        
        // 내가 모든 노드에 요청해서 모든 block 정보를 가져오는게 좋은가 아니면 1개 노드랑 진행하는 것이 좋은가?
        //console.log("t_OtherBlockinfo.length => ", t_OtherBlockinfo.length);
        //for()

        // 1개 노드랑 진행할 경우

        if(t_OtherBlockinfo == t_MyBlockinfo){
            return true;
        }


        // 내 블록이 더 길경우 상대방의 블록의 가장 마지막 블록이 같은지 검사한 후, 이후 블록을 전송
        
        else if(t_MyBlockinfo["length"]>t_OtherBlockinfo["length"]){
            var blockToSend = {};
            if(this.chain[t_OtherBlockinfo["length"]-1]["hash"] == t_OtherBlockinfo["length"]){
                var index = 0;
                //send My blocks from this.chain[t_OtherBlockinfo["length"]-1] to this.chain[length-1]
                for(var j = t_OtherBlockinfo["length"-1]; j < t_MyBlockinfo["length"]; j++){
                    blockToSend[index]= this.chain[j];
                    index++;
                }
                console.log("blockToSend => ",blockToSend)
                //this.blockSend(blockToSend)
            }
            // 상대방 블록이 나에게 없을 경우, 언제부터 포크가 발생한 지 모르기 때문에 나의 최근 50개 블록을 전송?
            // 아니면 전체 블록 전송?
            else{
                for(var j = 50; j <= 0; j--){
                    blockToSend[50-j]= this.chain[t_MyBlockinfo["length"]-j];
                }

                //this.blockSend(blockToSend)
            }

        }

        //내 블록이 더 짧을 경우, 상대방에게 다음 블록들을 요청한다.
        else if(t_MyBlockinfo["length"]<t_OtherBlockinfo["length"]){
            //요청

            //request(t_MyBlockinfo);
        }
    }
};




module.exports = Blockchain;



