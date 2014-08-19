define('SpeedLine',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    function SpeedLine(){
        Sprite.apply(this, arguments);
        this.size = {
            width: 1,
            height: 20
        };
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random() * (10 - 6) + 6
        };
        this.fillStyle = 'rgba(255,255,255,0.15)';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size.height
        };
    }

    proto = SpeedLine.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        vent.emit('bg-item-added', this);
        return this;
    };


    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }
        var ctx = this.ctx,
            pos = this.position;

        ctx.beginPath();
        ctx.rect(pos.x, pos.y, this.size.width, this.size.height);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
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
        if ( newX > this.canvas.height + this.size.height ) {
            this.restart();
        } else {
            pos.y = newX;
        }
    };


    proto.restart = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: -10
        };
    };

    return SpeedLine;

});
