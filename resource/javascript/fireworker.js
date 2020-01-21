(function(){
    'use strict';

    function FireWorkers(){
        this.fireWorkers = [];
        this.MAX_FIREWORKERS = 10;
        this._init_();

        setInterval(this.add, 800, this);
    }
    
    
    FireWorkers.prototype  = {
        options: {
    
        },
        _init_ : function(props){
            var _this = this;
            var canvas = document.getElementById('fireworker');
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");


            this._setOptions_(props);
    
            addEventListener('resize',(e)=>{
                canvas.height = e.target.innerHeight;
                canvas.width = e.target.innerWidth;
                this.canvas = canvas;
                this._setOptions_();
            });
            addEventListener('click',(e)=>{
                //添加一个指定位置爆炸的新的烟花
                this.add(this, e.x, e.y);
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
            //清空
            this.clear();
            // //生成渐变色(一组烟花的颜色)
            // var fireWorker = new FireWorker({
            //     'ctx' : this.ctx,
            //     'canvas' : this.canvas,
            //     'color' : Math.floor(Math.random() * 360 / 10) * 10
            // });

            //状态是结束的fireworker要释放掉
            this.fireWorkers = this.fireWorkers.filter(function(value, index, arr){
                return value.state !== 2;
            });

            for(var fireWorker of this.fireWorkers){
                fireWorker.update();
                fireWorker.render(this.ctx);

                // 计算当前位置和最终位置之间的长度
                var distance = Math.sqrt(Math.pow(this.canvas.width - fireWorker.pos.x, 2) + Math.pow(this.canvas.height - fireWorker.pos.y, 2));

                // random chance of 1% if rockets is above the middle
                var randomChance = fireWorker.pos.y < (this.canvas.width * 2 / 3) ? (Math.random() * 100 <= 1) : false;
                if(fireWorker.pos.y < this.canvas.height / 5 || fireWorker.vel.y >= 0 || distance < 50 || randomChance){
                    fireWorker.state = 1;
                    fireWorker.explode();
                }
            }
            
            
        },
        exist: function(){

        },
        add : function(_this, x, y){
            if(x === undefined || y === undefined){
                if(_this.fireWorkers.length < _this.MAX_FIREWORKERS){
                    var fireWorker = new FireWorker({
                        'canvas' : _this.canvas
                    });
                    fireWorker.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
                    fireWorker.vel.y = Math.random() * -3 - 4;
                    fireWorker.vel.x = Math.random() * 6 - 3;
                    fireWorker.size = 8;
                    fireWorker.shrink = 0.999;
                    fireWorker.gravity = 0.01;
                    _this.fireWorkers.push(fireWorker);
                }
            }else{
                //点击事件触发后，根据坐标计算初始速度
            }
            
        },
        clear : function(){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);  
        },
        loop: function(){
            this.render(this.ctx);
            
        }
        
    }
    window.FireWorkers = FireWorkers;


    function FireWorker(props){
        // `var pos = new Position(this.canvas.width / 2, this.canvas.height);`
        this.canvas = props.canvas;
        this.pos = props.pos ? props.pos: new Position(this.canvas.width / 2, this.canvas.height);
        this.particles = [];
        this.MAX_PARTICLES = 400;
        this.canvas = props.canvas;
        //type 0 爆炸烟花, type 1 喷泉烟花
        this.type = props.type ? props.type: 0;

        //速度
        this.vel = props.vel ? props.vel: {
            x: 0,
            y: 0
        };
        //收缩速度
        this.shrink = 0.97;
        //阻力
        this.resistance = 1;
        //重力加速度
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        //淡出速度 - alpha
        this.fade = 0;
        //烟花粒子颜色
        this.color = props.color ? props.color: 0;

        //烟花Particle的数量
        this.size = props.size? props.size: Math.floor(Math.random() * 5 + 5);

        //判断烟花状态的方法
        //爆炸烟花 0 上升阶段 ,1 爆炸阶段, 2 消失(释放)
        //喷泉烟花 0 上升阶段,            2 消失(释放)
        this.state = 0;

        var pos = new Position(this.pos.x, this.pos.y);
        var p = new Particle({
            'pos': pos,
            'canvas' : this.canvas ,
            'color' : this.color
        });
        p.size = 8;
        p.vel= this.vel;
        this.particles.push(p);
    }

    FireWorker.prototype = {
        render : function(ctx){
            for(var p of this.particles){
                if(p.exist()){
                    p.render(ctx);
                }
            }
        },
        //烟花爆炸的方法
        explode : function(){
            var count = Math.random() * 10 + 80;

            for (var i = 0; i < count; i++) {
                var particle = new Particle(this.pos);
                var angle = Math.random() * Math.PI * 2;
    
                // emulate 3D effect by using cosine and put more particles in the middle
                var speed = Math.cos(Math.random() * Math.PI / 2) * 15;
    
                particle.vel.x = Math.cos(angle) * speed;
                particle.vel.y = Math.sin(angle) * speed;
    
                particle.size = 10;
    
                particle.gravity = 0.2;
                particle.resistance = 0.92;
                particle.shrink = Math.random() * 0.05 + 0.93;
    
                particle.flick = true;
                particle.color = this.explosionColor;
    
                this.particles.push(particle);
            }
        },
        update : function(){
            var isMissing = false;
            for(var p of this.particles){
                p.update();
                if(!p.exist()){
                    isMissing = true;
                }
            }
            
            if(isMissing){
                this.state = 2;
            }
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
        //淡出速度 - alpha
        this.fade = 0;
        //烟花粒子颜色
        this.color = props.color ? props.color: 0;

        this.canvas = props.canvas;
    }

    Particle.prototype = {
        update : function(){
            // 施加阻力
            this.vel.x *= this.resistance;
            this.vel.y *= this.resistance;

            // 施加重力
            this.vel.y += this.gravity;

            // 根据速度更新坐标
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            // 形状缩放
            this.size *= this.shrink;

            // 淡出
            this.alpha -= this.fade;
        },
        render : function(ctx){
            console.log('render Particle:');
            var gradient = ctx.createRadialGradient(this.pos.x, this.pos.y, 0.1, this.pos.x, this.pos.y, this.size / 2);
            
            // console.log('position(x:' + this.pos.x + ',y:' + this.pos.y + ')');
            // console.log('vel(x:' + this.vel.x + ',y:' + this.vel.y + ')');
            
            gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

            ctx.save();
            //设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。
            //lighter: 显示源图像 + 目标图像。
            ctx.globalCompositeOperation = 'lighter';

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        //判断粒子消失的方法
        exist : function(){
            return this.alpha >= 0.1 && this.size >= 1;
        }
    }

    function Position(x, y){
        this.x = x;
        this.y = y;
    }


})();
