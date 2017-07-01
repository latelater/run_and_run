const Game = require("Game");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(0, 0),
        acce: 0,
        direction: 0,
        jumpSpeed:0,
        gravity:0,
        groundY: 0,
        skew: 0,
        score: 0,
        gameTemp: {
            default: null,
            type: cc.Node, 
        },
        scoreLala: {
            default: null,
            type: cc.Label,
        },
        btPlay: {
            default: null,
            type: cc.Button
        },        
        btPause: {
            default: null,
            type: cc.Button
        },   
        scoreAudio: { // 得分音效资源
            default: null,
            url: cc.AudioClip
        }, 
        jumpAudio: { 
            default: null,
            url: cc.AudioClip
        },
        monsterAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.up:
            case cc.KEY.w:
                this.dragonRole.playAnimation("jump");
                if(!this.jumping){ 
                    setTimeout(function () {
                        this.jumping = true;
                    }.bind(this), 300); // 实现连击
                }
                this.speed.y = this.jumpSpeed;//给了一个向上的初速度
                this.isHeight = false;
                this.playScoreSound(this.jumpAudio); // 播放jump音效
                break;
            case cc.KEY.s:
            case cc.KEY.down: 
                this.skew = 1;
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.s:
            case cc.KEY.down:
                this.skew = 0;
                this.judgeAnimation(); 
                break;
        }
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function(other, self) {
        if(this.name != 'PurpleMonster<BoxCollider>' || this.name == 'trap<BoxCollider>') { // 前一个碰撞物体为小怪物则this.name不改变
            this.name = other.name.toString();
        }
        
        if(this.name == 'star<BoxCollider>') { //判斷碰撞體是否為星星
            this.score += 1;
            this.scoreLala.string = "Score: " + this.score.toString();//星星加分的展示
            this.playScoreSound(this.scoreAudio); // 播放得分音效
        }

        if(this.name == 'PurpleMonster<BoxCollider>') {
            cc.find("Record").getComponent("Record").updateRunScore(this.score);
            cc.find("Record").getComponent("Record").updateThisScore(this.score);
            // cc.find("Record").getComponent("Record").updateThisBestScore(this.score);
            // console.log(this.name);
            this.playScoreSound(this.monsterAudio); // 播放怪兽音效
            setTimeout(function () {
                cc.director.loadScene('gameover');
            }.bind(this), 0); 
        }

        if(this.name == 'trap<BoxCollider>') {
            cc.find("Record").getComponent("Record").updateRunScore(this.score);
            cc.find("Record").getComponent("Record").updateThisScore(this.score);
            // cc.find("Record").getComponent("Record").updateThisBestScore(this.score);
            this.playScoreSound(this.monsterAudio); // 播放怪兽音效
            setTimeout(function () {
                cc.director.loadScene('gameover');
            }.bind(this), 500); 
        }
        // console.log(other);
        return other.name.toString();
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
        // console.log('on collision exit ######################');

        
    },

    btPlayClick: function() {
        this.btPausePressed = false;
        this.btPlayPressed = true;
        this.dragonRole.playAnimation ("walk");
    },

    btPauseClick: function() {
        this.btPausePressed = true;
        this.btPlayPressed = false;
        this.dragonRole.playAnimation ("stand");
    },

    playScoreSound: function (music) {  // 调用声音引擎播放声音
        cc.audioEngine.playEffect(music, false);
    },

    judgeAnimation: function() {
        if(this.btPausePressed || !this.btPlayPressed) {  //如果暂停按钮按下，或者是初始状态并未开始游戏则是stand状态
            this.dragonRole.playAnimation ("stand");
        }
        else if(this.btPlayPressed) { //按下paly按钮则是walk状态
            this.dragonRole.playAnimation ("walk");
        }
    },

    getScore: function() {
        return this.score
    },

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true; // 开启碰撞检测系统

        this.gameControl = this.gameTemp.getComponent("Game");
        // console.log(this.gameControl.getGroundRight());

        this.groundY = this.node.y;
        this.jumping = false;
        this.score = 0; // 分数初始化
        this.skew = 0;

        this.name = ''; // 碰撞物体的名称
        this.timer = 0;  // 初始化计时器

        this.isHeight = false; // 高度超过只置speed.y为0一次

        this.isDie = false; // 人物超出屏幕只播放die音乐一次 load场景一次

        var color = new cc.Color(this.node.color);
        this.newColor = color.clone();

        this.dragonRole = this.node.getComponent(dragonBones.ArmatureDisplay);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.btPlayPressed = false;
        this.btPausePressed = false;
        this.btPlay.node.on('click', this.btPlayClick, this);
        this.btPause.node.on('click', this.btPauseClick, this);

        // var node = new cc.Node(); //新建一个节点
        // this.sp = node.addComponent(cc.Label); //
        // console.log(this.sp);
        // node.parent = this.node;
        // node.setPosition(100,50);
        // this.sp.string = "Score: " + this.score;
    },

    update: function (dt) {

        var padding0 = this.node.x - this.gameControl.getGroundPositionX(0); // 距离背景0的距离
        var padding1 = this.node.x - this.gameControl.getGroundPositionX(1); // 距离背景1的距离

        // var padding = Math.abs(padding0) < Math.abs(padding1) ? padding0 : padding1;
        if(Math.abs(padding0) <= Math.abs(padding1)) { 
            if(this.gameControl.getGroundTop(0) + 45.5 > this.node.y) { // 如果地面升高，则人物不跳起即为走不过去
                this.speed.x = 400;
            }
            else {
                this.groundY = this.gameControl.getGroundTop(0) + 45.5; // 背景的上面为当前人物的地面
                this.speed.x = 0;
            }
        }
        else {
            if(this.gameControl.getGroundTop(1) + 45.5 > this.node.y) {
                this.speed.x = 400;
            }
            else {
                this.groundY = this.gameControl.getGroundTop(1) + 45.5; // 背景的上面为当前人物的地面
                this.speed.x = 0;
            }
        }

        if(this.node.y >= 220 && this.isHeight == false) {
            this.speed.y = 0;
            this.isHeight = true;
        }
        else {    
            this.speed.y += this.gravity * dt; 
        }
        
        if (this.jumping) { //跳起部分：有个初速度然后有个向下的重力加速度，跳到小于等于地面则会停下来
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
            if(this.speed.y <= 0) {
                this.dragonRole.playAnimation("fall");
                // this.speed.y = 0;
            }
            if(this.node.y <= this.groundY) {
                this.jumping = false; 
                this.judgeAnimation(); 
            }
        }
        // if(this.score >= 5){
        //     if(this.speed.x <= this.maxSpeed.x) {
        //         this.speed.x -= this.acce * dt;
        //     }
        // }
        this.node.y += this.speed.y * dt;  // 更新当前的位置
        this.node.x += this.speed.x * dt;
        if(this.node.x > 475 && this.isDie == false) {
            this.playScoreSound(this.monsterAudio); // 播放die音效
            setTimeout(function () {
                cc.director.loadScene('gameover');
            }.bind(this), 0); 
            this.isDie = true;
        }

        if(this.skew == 1){
            this.dragonRole.playAnimation ("stand");
            this.node.rotation = 90;
            console.log(this.node);
        }
        else {                 
            this.node.rotation = 0;
        }

        if(this.name == 'PurpleMonster<BoxCollider>' || this.name == 'trap<BoxCollider>'){
            // continue;
            // this.speed.y += (this.gravity + 2000) * dt;
        }
        else {
            if(this.node.y <= this.groundY){ //判斷當前幀時y軸小於等於地面則恢復位置
                this.node.y = this.groundY;   
            }
        } 
    },
});

