define('Laser',

['Sprite', 'util', 'vent'],

function( Sprite, util, vent ){

    'use strict';

    var proto;

    function Laser(){
        Sprite.apply(this, arguments);
        this.ctx = this.canvas.ctx;
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
        this.displayProps = {
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            lineWidth: 2,
            strokeStyle: '#444'
        };
    }

    proto = Laser.prototype = Object.create(Sprite.prototype);


    proto.create = function( opts ){
        this.position.x = opts.x;
        this.position.y = opts.y;
        vent.emit('laser-added', this);
        return this;
    };


    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }
        var pos = this.position;
        util.circle(this.ctx, pos.x, pos.y, this.size, util.randomColor(),
            this.displayProps
        );
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
            this.position.y += this.physics.velocity;
        }
    };


    proto.destroy = function(){
        this.position.x = 0;
        this.position.y = 0;
        this.destroyed = true;
        vent.emit('laser-destroyed', this);
    };

    return Laser;

});
