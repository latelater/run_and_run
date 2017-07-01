cc.Class({
    extends: cc.Component,

    properties: {
        bestScoreLabel: {
            default: null,
            type: cc.Label
        },
        thisScoreLabel: {
            default: null,
            type: cc.Label
        },

        thisBestScoreLabel: {
            default: null,
            type: cc.Label
        },

        btRePlay: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    btRePlayClick: function() {
        cc.director.loadScene('game');
    },
    onLoad: function () {   

        this.btRePlay.node.on('click', this.btRePlayClick, this);

        this.bestScore = cc.sys.localStorage.getItem('bestScore');
        this.bestScoreLabel.string = "本游戏最高分：" + this.bestScore.toString();

        this.thisScore = cc.sys.localStorage.getItem('thisScore');
        this.thisScoreLabel.string = "本次分数为：" + this.thisScore.toString();

        // this.thisBestScore = cc.sys.sessionStorage.getItem("thisBestScore");
        this.thisBestScore = 0;
        this.thisBestScoreLabel.string = "你的最高分为：" + this.thisBestScore.toString();
    },
});
