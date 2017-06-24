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
                if(!this.jumping){ 
                    setTimeout(function () {
                        this.jumping = true;
                    }.bind(this), 300); // 实现连击
                }
                this.speed.y = this.jumpSpeed;//给了一个向上的初速度
                break;
            case cc.KEY.s:
            case cc.KEY.down: 
                this.skew = 1;
                this.preAnimation = this.dragonRole.animationName;
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.s:
            case cc.KEY.down:
                // this.skew = 0;
                break;
        }
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function(other, self) {
        this.name = other.name.toString();
        if(this.name == 'star<BoxCollider>') { //判斷碰撞體是否為星星
            this.score += 1;
            this.scoreLala.string = "Score: " + this.score.toString();//星星加分的展示
        }
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

        if(this.name == 'PurpleMonster<BoxCollider>') {
            // console.log(this.name);
            setTimeout(function () {
                cc.director.loadScene('gameover');
            }.bind(this), 0); 
        }
        if(this.name == 'trap2<BoxCollider>') {
            setTimeout(function () {
                cc.director.loadScene('gameover');
            }.bind(this), 500); 
        }
        console.log(other);
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

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;//开启碰撞检测系统
        this.groundY = this.node.y;
        this.jumping = false;
        this.score = 0; //分数初始化

        this.name = '';//碰撞物体的名称
        this.timer = 0; //初始化计时器

        var color = new cc.Color(this.node.color);
        this.newColor = color.clone();

        this.dragonRole = this.node.getComponent(dragonBones.ArmatureDisplay);
        // this.poly = this.node.getComponent(PolygonCollider);
        // console.log

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.btPlayPressed = false;
        this.btPausePressed = false;
        this.btPlay.node.on('click', this.btPlayClick, this);
        this.btPause.node.on('click', this.btPauseClick, this);

        this.preAnimation = 'walk';

        // var node = new cc.Node(); //新建一个节点
        // this.sp = node.addComponent(cc.Label); //
        // console.log(this.sp);
        // node.parent = this.node;
        // node.setPosition(100,50);
        // this.sp.string = "Score: " + this.score;
    },

    update: function (dt) {
        if (this.jumping) { //跳起部分：有个初速度然后有个向下的重力加速度，跳到小于等于地面则会停下来
            this.dragonRole.playAnimation("jump");
            this.speed.y += this.gravity * dt; 
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
            if(this.speed.y <= 0) {
                this.dragonRole.playAnimation("fall");
            }
            if(this.node.y <= this.groundY) {
                this.jumping = false; 
                
                if(this.btPausePressed || !this.btPlayPressed) {  //如果暂停按钮按下，或者是初始状态并未开始游戏则是stand状态
                    this.dragonRole.playAnimation ("stand");
                }
                else if(this.btPlayPressed) { //按下paly按钮则是walk状态
                    this.dragonRole.playAnimation ("walk");
                } 
                // else {
                //     this.dragonRole.playAnimation ("stand");
                // }
            }
        }
        // if(this.score >= 5){
        //     if(this.speed.x <= this.maxSpeed.x) {
        //         this.speed.x -= this.acce * dt;
        //     }
        // }
        this.node.y += this.speed.y * dt;
        // this.node.x += this.speed.x * dt;
        if(this.skew == 1){
            // this.dragonRole.playAnimation ("flip");
            // this.skew = 0;
        }
        else {
            // this.node.skewX = 0;
            // this.node.scaleY = 1;
            // this.dragonRole.playAnimation (this.preAnimation);
        }
        if(this.name == 'PurpleMonster<BoxCollider>' || this.name == 'trap2<BoxCollider>'){
            // continue;
            this.speed.y += this.gravity * dt;
        }
        else {
            if(this.node.y <= this.groundY){ //判斷當前幀時y軸小於等於地面則恢復位置
                    this.node.y = this.groundY;   
            }
        } 
    },
});

