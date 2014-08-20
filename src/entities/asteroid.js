define('Asteroid',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    function Asteroid(){
        Sprite.apply(this, arguments);
        this.ctx = this.canvas.ctx;
        this.size = util.random(30, 50);
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: util.random(-1, -0.5)
         };
        this.fillStyle = '#684a3b';
        this.position = {
            x: 0,
            y: this.canvas.height + this.size
        };
    }

    proto = Asteroid.prototype = Object.create(Sprite.prototype);


    proto.create = function( xPos ){
        this.position.x = xPos;
        vent.emit('laser-added', this);
        return this;
    };


    proto.update = function(){
        this.physics.velocity = util.approach(
          this.physics.velocityGoal, this.physics.velocity, this.physics.friction
        );
        if ( this.position.y < 0 - this.size*2 ) {
            console.log('about to destroy');
            this.destroy();
        } else {
            this.position.y = this.position.y + this.physics.velocity;
        }
    };


    proto.render = function(){
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowColor = this.fillStyle;

        this.ctx.fillStyle = this.fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(
          this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false
        );
        this.ctx.fill();
    };


    proto.destroy = function(){
        this.position.x = 0;
        this.position.y = 0;
        this.destroyed = true;
        vent.emit('laser-destroyed', this);
    };


    return Asteroid;

});
