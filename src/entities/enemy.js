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
            velocityGoal: Math.random() * (8 - 3) + 3
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
        var ctx = this.ctx,
            pos = this.position;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(241, 241, 241, 1)';

        ctx.fillStyle = 'rgba(241, 241, 241, 1)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#444';
        ctx.stroke();
    };


    proto.update = function(){
        if ( this.destroyed ) {
            return;
        }

        var p = this.physics,
            pos = this.position,
            approach = util.approach,
            newX;

        p.velocity = approach(p.velocityGoal, p.velocity, p.friction);
        newX = pos.y + p.velocity;
        if ( newX > this.canvas.height + this.size ) {
            this.destroy();
        } else {
            pos.y = newX;
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
        this.physics.velocityGoal = Math.random() * (8 - 3) + 3;
        this.destroyed = false;
        this.fillStyle = util.randomColor();
        vent.emit('entity-added', this);
    };

    return Enemy;

});
