const star = require("Star");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.stars = new star();
        this.score = 0;
    },

    update: function(dt) {
        this.score = this.stars.getScore();
        this.node.string = "lalala: " + this.score;
    },
});
