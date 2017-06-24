const BackGround = require('BackGround');

cc.Class({
    extends: cc.Component,

    properties: {
        bgPrefab: {
            default: null,
            type: cc.Prefab
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        monsterPrefab: {
            default: null,
            type: cc.Prefab
        },
        trapPrefab: {
            default: null,
            type: cc.Prefab,
        },
        role: {
            default: null,
            type: cc.Node
        },
        btPlay: {
            default: null,
            type: cc.Button
        },        
        btPause: {
            default: null,
            type: cc.Button
        },
        btRePlay: {
            default: null,
            type: cc.Button
        }
    },

    btPlayClick: function() {
        this.btPausePressed = false;
        this.btPlayPressed = true;
        for(var i = 0; i < this.Bgs.length; i++){
            this.Bgs[i].speedX = 400;
        } 
        
    },

    btPauseClick: function() {
        this.btPausePressed = true;
        this.btPlayPressed = false;
        for(var i = 0; i < this.Bgs.length; i++){
            this.Bgs[i].speedX = 0;
        } 
    },

    btRePlayClick: function() {
        cc.game.restart ();
    },

     getRandom: function () {
        var range = [0,1,2,3,4,5,6,7,8,9];
        var random = 10;
        random = Math.ceil(Math.random() * 9); //ceil向上取整
        return random;
    },

    newScore: function() {
        var node = new cc.Node();
        this.sp = node.addComponent(cc.Label);
        // console.log(this.sp);
        node.parent = this.node;
        node.setPosition(-345,200);
        this.sp.string = "Score: " + this.score;
        // console.log("scorelalala: ");
    },

    newPauActivity: function() {
        var newPau = cc.instantiate(this.monsterPrefab);
        newPau.parent = this.node;
        // var randomX = this.getRandom();
        var randomY = this.getRandom();
        this.mPositionX = this.sPositionX + 150;

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


    newStarActivity: function() {
        var newStar = cc.instantiate(this.starPrefab);
        newStar.parent = this.node;
        var randomX = this.getRandom();
        var randomY = this.getRandom();
        this.sPositionX = -500;
        this.sPositionY = 100;
        if(randomX >= 0 && randomX <= 1){
            this.sPositionX = -500;
        }
        else if(randomX >= 2 && randomX <= 4){
            this.sPositionX = -300;
        }
        else if(randomX >= 5 && randomX <= 6){
            this.sPositionX = -200;
        }
        else if(randomX >= 7 && randomX <=9){
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


    // use this for initialization
    onLoad: function () {
        this.Bg = this.node.getComponentInChildren('BackGround');
        // this.Bgs = this.node.getComponentsInChildren('BackGround');
        this.btPlayPressed = false;
        this.btPausePressed = false;
        this.bgPool = new cc.NodePool();
        this.sPositionX = 100;
        this.sPositionY = 0;
        this.mPositionX = 0;
        this.mPositionY = 0;
        this.tPositionX = 0;
        var length = 5;

        this.newBg = cc.instantiate(this.bgPrefab);
        this.newBg.parent = this.node;
        this.newBg.setPosition(cc.v2(-1798, -4));
        console.log(this.newBg.getPosition());
        // for(var i = 0; i < 5; i++){
        //     var newBg = cc.instantiate(this.bgPrefab);
        //     this.bgPool.put(newBg);
        // }
        this.posX = 0; //背景的当前位置
        this.timer = 0; //计时器
        this.starTimer = 0;
        var len = 0;
        this.BgNode = [];
        this.Bgs = this.node.getComponentsInChildren('BackGround');
        for(var i = 0; i < this.Bgs.length; i++){
            if(this.Bgs[i].acce == 800) {
                this.BgNode[len] = this.Bgs[i];
                len ++;
            }
        }
        console.log(this.BgNode);
        
        console.log(this.Bgs);
        this.btPlay.node.on('click', this.btPlayClick, this);
        this.btPause.node.on('click', this.btPauseClick, this);
        this.btRePlay.node.on('click', this.btRePlayClick, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // console.log(this.Bgs);
        if(this.btPlayPressed){ //按下开始键计时
            this.timer ++;
            
        }
        this.starTimer ++;

        if(this.starTimer == 1) {
            console.log(this.Bgs[0].node.x);
            console.log(this.Bgs[1].node.x);
        }

        if(this.timer >= 200) {
            var random = this.getRandom();
            if(random >= 0 && random <= 1) {
                this.newPauActivity();
            }
            else if(random >= 2 && random <= 4) {
                this.newStarActivity();
                this.newPauActivity();
            }
            else if(random >= 5 && random <= 9) {
                this.newStarActivity();
            }
            // 使用给定的模板在场景中生成一个新节点
            // var newBg = cc.instantiate(this.bgPrefab);
            // 将新增的节点添加到 Game 节点下面
            // console.log()
            // if(this.btPlay._Pressed == true) { //play开始生成

            // if(newBg) {
            //     this.bgPool.put(newBg);//回收对象
            // }
            // if(this.bgPool.size() > 0) {  
            //     var newBg = this.bgPool.get();//取对象
            // }
            // else {
            //     var newBg = cc.instantiate(this.bgPrefab);
            // }
            // newBg.parent = this.node;

            // var newGround = newBg.getComponentInChildren("Ground");
            // this.node.scaleY = 1;
            // newGround.scaleY = 0.1;
            // console.log("newBg"+newBg);
           // 为背景设置一个位置
            this.timer = 0;
            this.Bgs = this.node.getComponentsInChildren('BackGround');
            for(var i = 0; i < this.Bgs.length; i++){
                this.Bgs[i].speedX = 400;
             }

         // }
        }
        // console.log(this.BgNode[0].node.x);
        if(this.BgNode[0].node.x >= 231 && this.BgNode[0].node.x <= 240) { //这里有问题
            this.BgNode[1].node.x = -1798;
        }
        if(this.BgNode[1].node.x >= 231 && this.BgNode[1].node.x <= 240) {
            this.BgNode[0].node.x = -1798;
        }
    },
});
