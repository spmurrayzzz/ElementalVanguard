define('Player',

['Sprite', 'vent', 'Laser', 'util', 'spritePool'],

function( Sprite, vent, Laser, util, pool ){

    'use strict';

    var proto;

    function Player(){
        Sprite.apply(this, arguments);
        this.ctx.fillStyle = "rgb(200,0,0)";
        this.size = 40;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 0.98,
            velocity: 0,
            velocityGoal: 0
        };
        this.keyPressed = false;
        this.laserPool = [];
        this.lastFired = new Date().getTime();
    }

    proto = Player.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        this.position = {
            x: this.canvas.width/2,
            y: this.canvas.height - 52
        };
        this.isCreated = true;
        vent.on('keydown', this.move.bind(this));
        vent.on('keyup', this.stop.bind(this));
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 32 ) {
                this.fire();
            }
        }.bind(this));
        Sprite.prototype.create.call(this);
    };


    proto.render = function(){
        if ( !this.isCreated ) {
            return false;
        }

        this.ctx.save();
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowColor = "rgba(0, 220, 0, 0.6)";

        this.ctx.fillStyle = 'rgba(120, 220, 0, 1)';
        this.ctx.beginPath();
        this.ctx.arc(
          this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false
        );
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = 'rgba(0, 100, 0, 0.7)';
        this.ctx.stroke();
        this.ctx.restore();
    };


    proto.move = function( ev ){
        if ( this.keyPressed ) {
            return;
        }

        var regex = /^(37|39)/g,
            key = ev.keyCode;

        if ( !regex.test(key) ) {
            return;
        }

        this.physics.velocityGoal = key === 37 ? -8 : 8;
        this.keyPressed = true;

    };


    proto.stop = function( ev ){
        var regex = /^(37|39)/g,
            key = ev.keyCode;

        if ( !regex.test(key) ) {
            return;
        }

        this.physics.velocityGoal = 0;
        this.keyPressed = false;
    };


    proto.fire = function(){
        if ( this.lastFired > new Date().getTime() - 200 ) {
            return;
        }

        var laser = pool.recycle('lasers'),
            pos = {
                x: this.position.x,
                y: this.position.y - this.size - 10
            };

        if ( !laser ) {
            laser = new Laser(this.canvas);
            pool.register('lasers', laser);
        } else {
            laser.destroyed = false;
        }

        laser.create(pos);
        this.lastFired = new Date().getTime();
        vent.emit('shoot');
    };


    proto.update = function(){
        this.physics.velocity = util.approach(
          this.physics.velocityGoal, this.physics.velocity, 0.8
        );

        if ( this.position.x + this.physics.velocity >=
          this.canvas.width - this.size ) {
            this.position.x = this.canvas.width - this.size;
        } else if ( this.position.x + this.physics.velocity <= 0 + this.size ) {
            this.position.x = 0 + this.size;
        } else {
            this.position.x = this.position.x + this.physics.velocity;
        }
    };


    return Player;

});
