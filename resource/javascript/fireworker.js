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
                _this._setOptions();
            });
            addEventListener('click',(e)=>{
                //添加一个指定位置爆炸的新的烟花
                _this.add(e.x, e.y);
            });

            requestAnimationFrame(function loop(){
                _this.loop();
            });
        },
        _setOptions_ : function(props){
    
        },
        render : function(ctx){
            var _this = this;
            //清空
            _this.clear();
            //绘制点
            var pos = new Position(0, 0);
            var p = new Particle(pos);
            p.render(ctx);
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

    //像素点Object
    function Particle(props){
        var pos = props['pos'];
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
        this.shrink = 0.97;
        this.size = 2;

        this.resistance = 1;
        //重力加速度
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        this.fade = 0;
        this.color = 0;
    }

    Particle.prototype = {
        update : function(){
            
        },
        render : function(ctx){
            console.log('render Particle:');
            ctx.arc(200,200,75,0,360*Math.PI/180);
            ctx.closePath();
            ctx.fillStyle="#FF89C9";
            ctx.fill();
        },
        //粒子消失的方法
        exist : function(){
            return true;
        }
    }

    function Position(x, y){
        this.x = x;
        this.y = y;
    }


})();
