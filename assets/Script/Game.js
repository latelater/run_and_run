
cc.Class({
    extends: cc.Component,

    properties: {
        bgpeedX: 0,
        bgAcce: 0,
        bgPrefab: {
            default: null,
            type: cc.Prefab,
        },
        starPrefab: {
            default: null,
            type: cc.Prefab,
        },
        monsterPrefab: {
            default: null,
            type: cc.Prefab,
        },
        trapPrefab: {
            default: null,
            type: cc.Prefab,
        },
        dragonRole: {
            default: null,
            type: cc.Node,
        },
        btPlay: {
            default: null,
            type: cc.Button,
        },        
        btPause: {
            default: null,
            type: cc.Button,
        },
        btRePlay: {
            default: null,
            type: cc.Button,
        },
        // 按键音效资源
        btnAudio: {
            default: null,
            url: cc.AudioClip,
        },
    },

    btPlayClick: function() {
        
        this.btPausePressed = false;
        this.btPlayPressed = true;
        this.updateAllSpeedX();
        this.playBtnSound();   
    },

    btPauseClick: function() {
        // if( state != gaming){
        //     return;
        // }
        this.btPausePressed = true;
        this.btPlayPressed = false;
        this.Bgs = this.node.getComponentsInChildren('BackGround');
        for(var i = 0; i < this.Bgs.length; i++){
            this.Bgs[i].speedX = 0;
        } 
        this.playBtnSound();
    },

    btRePlayClick: function() {

        cc.game.restart ();
        this.playBtnSound();
    },

    playBtnSound: function () {  // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.btnAudio, false);
    },

    getRandom: function () {

        var range = [0,1,2,3,4,5,6,7,8,9];
        var random = 10;
        random = Math.ceil(Math.random() * 9); //ceil向上取整
        return random;
    },

    newScore: function() { //分数节点的新建以及内容的更新

        var node = new cc.Node();
        this.sp = node.addComponent(cc.Label);
        node.parent = this.node;
        node.setPosition(-345,200);
        this.sp.string = "Score: " + this.score;
    },

    newPauActivity: function() { //怪物预制的生成

        var newPau = cc.instantiate(this.monsterPrefab);
        newPau.parent = this.node;
        var randomX = this.getRandom();
        var randomY = this.getRandom();
        this.mPositionX = this.sPositionX - 150;

        if(randomY >= 0 && randomY <= 3){
            this.mPositionY = 35;
        }
        else if(randomY >= 4 && randomY <= 7){
            this.mPositionY = -60;
        }
        else {
            this.mPositionY = 0;
        }
        newPau.setPosition(cc.v2(this.mPositionX, this.mPositionY));
        newPau.speedX = 400;

    },

    newStarActivity: function() { //星星预制的生成
// 分拆
        var newStar = cc.instantiate(this.starPrefab);
        newStar.parent = this.node;

        var randomX = this.getRandom();
        var randomY = this.getRandom();
        this.sPositionX = -500;
        this.sPositionY = 100;
        if(randomX >= 0 && randomX <= 1){
            this.sPositionX = -500;
        }
        else if(randomX > 1 && randomX <= 4){
            this.sPositionX = -300;
        }
        else if(randomX > 4 && randomX <= 6){
            this.sPositionX = -200;
        }
        else if(randomX > 6 && randomX <=9){
            this.sPositionX = -400;
        }

        if(randomY >= 0 && randomY <= 3){
            this.sPositionY = 100;
        }
        else if(randomY >= 4 && randomY <= 7){
            this.sPositionY = -60;
        }
        else {
            this.sPositionY = 0;
        }
        newStar.setPosition(cc.v2(this.sPositionX, this.sPositionY));
        newStar.speedX = 400;
        return 1;
    },

    newTrap: function() {
        var newTrap = cc.instantiate(this.trapPrefab);
        newTrap.parent = this.node;

        var randomX = this.getRandom();
        // this.tPositionX = -1200;
        if(randomX >= 0 && randomX <= 4) {
            this.tPositionX = -1200;
            var padding0 = this.tPositionX - this.getGroundPositionX(0); // 距离背景0的距离
            var padding1 = this.tPositionX - this.getGroundPositionX(1); // 距离背景1的距离
            if(Math.abs(padding0) <= Math.abs(padding1)) { 
                this.tPositionY = this.groundNode[0].node.y;
            }
            else {
                this.tPositionY = this.groundNode[1].node.y;
            }
        }
        // else {
        //     if(randomX >= 4 && randomX <= 6) {
        //         this.tPositionX = -1300;
        //     }
        // }

        
        newTrap.setPosition(cc.v2(this.tPositionX, this.tPositionY));
        newTrap.speedX = 400;
        
    },

    groundHeightChange: function(ground) { //地板的高低

        var random = this.getRandom();
        var isHeightChange = false;
        if(random >= 0 && random <= 3) {
            ground.node.y = -355;
            isHeightChange = true;
        }
        else {
            ground.node.y = -233;
            isHeightChange = false;
        }
        return isHeightChange;
    },

    getGroundTop: function(number) {

        var thisGround = this.groundNode[number];
        var groundTop = thisGround.node.y + thisGround.node.height/2;
        return groundTop;
    },

    getGroundPositionX: function(number) {
        return this.BgNode[number].node.x;
    },

    getGroundLeft: function(bg) {

        var thisBackground = bg;
        var groundRight = thisBackground.x - thisBackground.width/2;
        return groundRight;
    },

    updateAllSpeedX: function() {
        this.Bgs = this.node.getComponentsInChildren('BackGround');
        for(var i = 0; i < this.Bgs.length; i++){
            this.Bgs[i].speedX = this.bgpeedX;
        }
    },

    // use this for initialization
    onLoad: function () {

        this.btPlayPressed = false;
        this.btPausePressed = false;
        this.sPositionX = 100;
        this.sPositionY = 0;
        this.mPositionX = 0;
        this.mPositionY = 0;
        this.tPositionX = 583;
        this.tPositionY = -177;

        this.bgpeedX = 400;
        this.bgAcce = 10;

        this.newBg = cc.instantiate(this.bgPrefab);
        this.newBg.parent = this.node;
        this.newBg.setPosition(cc.v2(3000, -4)); //初始随便放在一个地方
        this.posX = 0; //背景的当前位置
        this.timer = 0; //计时器
        this.starTimer = 0;
        this.trapTimer = 0;
        this.monsterTimer = 0;
        var len = 0;
        this.BgNode = [];
        this.groundNode = [];
        this.Bgs = this.node.getComponentsInChildren('BackGround');
        for(var i = 0; i < this.Bgs.length; i++){
            if(this.Bgs[i].acce == 800) {
                this.BgNode[len] = this.Bgs[i];
                this.groundNode[len] = this.BgNode[len].getComponentInChildren("Ground");
                len ++;
            }
        }

        this.role = this.dragonRole.getComponent("Dragon");
        // console.log(this.role.score);
        this.btPlay.node.on('click', this.btPlayClick, this);
        this.btPause.node.on('click', this.btPauseClick, this);
        this.btRePlay.node.on('click', this.btRePlayClick, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(this.btPlayPressed){ //按下开始键计时
            this.timer ++;
            this.starTimer ++;
            this.monsterTimer ++;
            this.trapTimer ++;
        }

        if(this.role.score >= 5 && this.role.score <= 20 && this.bgpeedX <= 550) { // 在分数为5到20之间加速至550
            this.bgpeedX += this.bgAcce*dt;
            this.updateAllSpeedX();
        }
        else {
            if(this.role.score > 20 && this.role.score <= 30 && this.bgpeedX <= 650) {
                this.bgpeedX += this.bgAcce*dt;
                this.updateAllSpeedX();
            }
            else {
                if(this.role.score > 30 && this.bgpeedX <= 800) {
                    this.bgpeedX += this.bgAcce*dt;
                    this.updateAllSpeedX();
                } 
            }
        }
        
        if(this.starTimer >= 200) {
            // console.log("12344556890");
            this.newStarActivity();
            this.updateAllSpeedX();
            this.starTimer = 0;
        }

        if(this.timer >= 300) {
            var random = this.getRandom();
            if(random >= 0 && random <= 3) {
                this.newPauActivity();
            }
            else if(random >= 4 && random <= 6) {
                this.newStarActivity();
                this.newPauActivity();
            }
            else if(random >= 7 && random <= 9) {
                this.newTrap();
            }
            this.timer = 0;
            this.updateAllSpeedX();
        }

        if(this.BgNode[0].node.x >= 231 && this.BgNode[0].node.x <= 245) { //这里有问题
            this.BgNode[1].node.x = this.getGroundLeft(this.BgNode[0].node) - this.BgNode[1].node.width/2;
            this.groundHeightChange(this.groundNode[1]);
        }
        if(this.BgNode[1].node.x >= 231 && this.BgNode[1].node.x <= 245) {
            this.BgNode[0].node.x = this.getGroundLeft(this.BgNode[1].node) - this.BgNode[0].node.width/2;
            this.groundHeightChange(this.groundNode[0]);
            
        }
    },
});
