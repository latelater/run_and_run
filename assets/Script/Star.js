const Game = require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
        time: 0,
    },

    getScore: function() {
        return this.score;
    },


    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;//开启碰撞检测系统
        this.time = 0;
        this.score = 0;
        // this.newGame = new Game(); //直接new一个RoleRun类型
        
    },
    
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function(other, self) {
        setTimeout(function () {
            this.node.destroy();
        }.bind(this), this.time);
        this.score += 1;
        // console.log(this.score);
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
    },

    onCollisionExit: function (other, self) {
        // console.log('on collision exit');
        var temp = 0;
    },

    update: function (dt) {

    },
});
