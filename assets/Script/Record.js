cc.Class({
    extends: cc.Component,

    properties: {
        bestScore: 0,
        thisScore: 0,
        thisBestScore: 0,
    },

    updateRunScore: function(score){
        if(score > this.bestScore){
            this.bestScore = score;
            cc.sys.localStorage.setItem('bestScore', this.bestScore);
        }
    },

    updateThisScore: function(score){
        this.thisScore = score;
        cc.sys.localStorage.setItem('thisScore', this.thisScore);
    },

    // updateThisBestScore: function(score) {
    //     if(score > this.thisBestScore){
    //         this.thisBestScore = score;
    //         cc.sys.sessionStorage.setItem('thisBestScore', this.thisBestScore);
    //     }
    // },

    onLoad: function () {

        cc.game.addPersistRootNode(this.node); // 将此节点设为常驻节点
        if(!cc.sys.localStorage.getItem("bestScore")) {   
            cc.sys.localStorage.setItem("bestScore", 0);
        }

        if(!cc.sys.localStorage.getItem("thisScore")) {   
            cc.sys.localStorage.setItem("thisScore", 0);
        }

        // if(!cc.sys.sessionStorage.getItem("thisBestScore")) {
        //     cc.sys.sessionStorage.setItem("thisBestScore", 0);
        // }

        this.bestScore = cc.sys.localStorage.getItem("bestScore"); // 取出上次缓存的最高成绩
        this.thisScore = 0; // 本次游戏分数，初始化为0
        // this.thisBestScore = cc.sys.sessionStorage.getItem("thisBestScore"); // 本窗口缓存的最高成绩
    },

});
