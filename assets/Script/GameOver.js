cc.Class({
    extends: cc.Component,

    properties: {
        btRePlay: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    btRePlayClick: function() {
        cc.director.loadScene('start');
    },
    onLoad: function () {   
        this.btRePlay.node.on('click', this.btRePlayClick, this);
    },
});
