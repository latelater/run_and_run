
const RoleRun = require('RoleRun');
const Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        maxSpeedX: 0,
        acce: 0,
        roleRun : RoleRun,
    },

    onLoad: function () {
        // var role = this.node.getComponentInChildren(RoleRun);//取孩子节点的为RoleRun类型的组件
        // var new_role = new RoleRun(); //直接new一个RoleRun类型 
        this.speedX = 0;
    },
    
    myGetPosition: function() {
        return this.node.getPositionX();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.x += this.speedX * dt;
    },
});
