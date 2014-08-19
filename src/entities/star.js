define('Star',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    function Star(){
        Sprite.apply(this, arguments);
        this.size = Math.random() * (1.4 - 0.3) + 0.3;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random() * (6 - 1) + 1
        };
        this.fillStyle = 'rgba(241,241,241,' +
            Math.random() * ((0.8 - 0.3) + 0.3) + ')';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size
        };
    }

    proto = Star.prototype = Object.create(Sprite.prototype);


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
        ctx.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI, false);
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
        if ( newX > this.canvas.height + this.size ) {
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

    return Star;

});
