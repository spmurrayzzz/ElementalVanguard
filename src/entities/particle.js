define('Particle',

['Sprite', 'util'],

function( Sprite, util ){

    'use strict';

    var proto;

    function Particle(){
        Sprite.apply(this, arguments);
        this.size = 2;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random()*3 + 2
        };

        var direction = this.direction = Math.random()*2*Math.PI;
        this.xInc = function(){
            return Math.cos(direction) * this.physics.velocity;
        };
        this.yInc = function(){
            return Math.sin(direction) * this.physics.velocity;
        };

        this.life = Math.random() * (50-30) + 30;
        this.fillStyle = 'rgba(244,0,8,' +
            Math.random() * ((1 - 0.5) + 0.5) + ')';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size
        };
        this.bindRefs = {};
    }

    proto = Particle.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        this.bindEvents();
        return this;
    };


    proto.bindEvents = function(){};


    proto.restart = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: -10
        };
    };


    proto.update = function(){
        this.physics.velocity = util.approach(
            this.physics.velocityGoal,
            this.physics.velocity,
            this.physics.friction
        );
        this.position.y += this.yInc();
        this.position.x += this.xInc();
        this.life--;
    };


    proto.render = function(){
        util.circle(this.ctx,
            this.position.x, this.position.y, this.size, this.fillStyle
        );
    };

    return Particle;

});
