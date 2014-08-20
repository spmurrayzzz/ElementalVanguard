define('Laser',

['Sprite', 'util', 'vent'],

function( Sprite, util, vent ){

    'use strict';

    var proto;

    function Laser(){
        Sprite.apply(this, arguments);
        this.ctx = this.canvas.elem.getContext('2d');
        this.size = 10;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: -6
        };
        this.position = {
            x: 100,
            y: 100
        };
    }

    proto = Laser.prototype = Object.create(Sprite.prototype);


    proto.create = function( opts ){
        this.position = opts;
        vent.emit('laser-added', this);
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
        ctx.shadowColor = "rgba(241, 241, 241, 0.9)";

        ctx.fillStyle = util.randomColor();//'#00d14e';
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

        this.physics.velocity = util.approach(
          this.physics.velocityGoal, this.physics.velocity, this.physics.friction
        );
        if ( this.position.y + this.physics.velocity < 0 - this.size ) {
            this.destroy();
        } else {
            this.position.y = this.position.y + this.physics.velocity;
        }
    };


    proto.destroy = function(){
        this.position = { x: 0, y: 0 };
        this.destroyed = true;
        vent.emit('laser-destroyed', this);
    };

    return Laser;

});
