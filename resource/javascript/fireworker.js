(function(){
    'use strict';

    function FireWorkers(){
        this._init_();
    }
    
    
    FireWorkers.prototype  = {
        options: {
    
        },
        _init_ : function(props){
            var _this = this;
           
            var canvas = document.getElementById('fireworker');
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            _this.canvas = canvas;
            _this.ctx = canvas.getContext("2d");

            _this._setOptions_(props);
    
            addEventListener('resize',(e)=>{
                canvas.height = e.target.innerHeight;
                canvas.width = e.target.innerWidth;
                _this.canvas = canvas;
                _this._setOptions_();
            });
            addEventListener('click',(e)=>{
                //添加一个指定位置爆炸的新的烟花
                _this.add(e.x, e.y);
            });

            function loop(){
                _this.loop();
                requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
        },
        _setOptions_ : function(props ){
    
        },
        render : function(ctx){
            var _this = this;
            //清空
            _this.clear();
            //生成渐变色(一组烟花的颜色)
            var fireWorker = new FireWorker({
                'ctx' : _this.ctx,
                'canvas' : _this.canvas,
                'color' : Math.floor(Math.random() * 360 / 10) * 10
            });
            
        },
        exist: function(){

        },
        add : function(x, y){
    
        },
        clear : function(){
            var _this = this;
            _this.ctx.clearRect(0,0,_this.canvas.width,_this.canvas.height);  
        },
        loop: function(){
            var _this = this;
            _this.render(_this.ctx);
            
        }
        
    }
    window.FireWorkers = FireWorkers;


    function FireWorker(props){
        var _this = this;
        _this.ctx = props.ctx;
        _this.canvas = props.canvas;
        //type 0 爆炸烟花, type 1 喷泉烟花
        _this.type = props.type ? props.type: 0;
        //烟花颜色
        _this.color = props.color ? props.color: 0;
    }

    FireWorker.prototype = {
        render : function(){
            var pos = new Position(_this.canvas.width / 2, _this.canvas.height);
            var p = new Particle({
                'pos': pos,
                'color' : _this.color
            });
            if(p.exist()){
                p.render(ctx);
            }
        },
        //烟花爆炸的方法
        explode : function(){

        },
        //判断烟花状态的方法
        //爆炸烟花 0 上升阶段 ,1 爆炸阶段, 2 消失(释放)
        //喷泉烟花 0 上升阶段,            2 消失(释放)
        state : function(){
            return 0;
        }

    }


    //像素点Object
    function Particle(props){
        var pos = props.pos;
        //位置
        this.pos = {
            x: pos ? pos.x : 0,
            y: pos ? pos.y : 0
        };
        //速度
        this.vel = {
            x: 0,
            y: 0
        };
        //收缩速度
        this.shrink = 0.97;
        //大小 -size
        this.size = 2;
        //阻力
        this.resistance = 1;
        //重力加速度
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        //褪色速度 - alpha
        this.fade = 0;
        //烟花粒子颜色
        this.color = props.color ? props.color: 0;
    }

    Particle.prototype = {
        update : function(){
            
        },
        render : function(ctx){
            var _this = this;
            console.log('render Particle:');
            var gradient = ctx.createRadialGradient(_this.pos.x, _this.pos.y, 0.1, _this.pos.x, _this.pos.y, _this.size / 2);
            gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            gradient.addColorStop(0.8, "hsla(" + _this.color + ", 100%, 50%, " + _this.alpha + ")");
            gradient.addColorStop(1, "hsla(" + _this.color + ", 100%, 50%, 0.1)");

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.flick ? Math.random() * _this.size : _this.size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        },
        //粒子消失的方法
        exist : function(){
            return this.alpha >= 0.1 && this.size >= 1;
        }
    }

    function Position(x, y){
        this.x = x;
        this.y = y;
    }


})();
