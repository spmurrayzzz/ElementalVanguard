define('Enemy',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    function Enemy(){
        Sprite.apply(this, arguments);
        this.fillStyle = util.randomColor();
        this.size = 30;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random() * (2 - 1) + 1
        };
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size
        };
    }

    proto = Enemy.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        Sprite.prototype.create.call(this);
        return this;
    };


    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowColor = 'rgba(241, 241, 241, 1)';

        this.ctx.fillStyle = 'rgba(241, 241, 241, 1)';
        this.ctx.beginPath();
        this.ctx.arc(
          this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false
        );
        this.ctx.fill();
    };


    proto.update = function(){
        if ( this.destroyed ) {
            return;
        }

        this.physics.velocity = util.approach(
          this.physics.velocityGoal,
          this.physics.velocity,
          this.physics.friction
        );

        if ( this.position.y + this.physics.velocity >
          this.canvas.height + this.size ) {
            this.destroy();
        } else {
            this.position.y = this.position.y + this.physics.velocity;
        }
    };


    proto.destroy = function(){
        this.position = { x: 0, y: 0 };
        this.destroyed = true;
        vent.emit('entity-destroyed', this);
    };


    proto.recycle = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size
        };
        this.physics.velocityGoal = Math.random() * (2 - 1) + 1;
        this.destroyed = false;
        this.fillStyle = util.randomColor();
        vent.emit('entity-added', this);
    };

    return Enemy;

});
