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
            y: this.canvas.height
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
        var pos = this.position,
            ctx = this.ctx;

        if ( !this.isCreated ) {
            return false;
        }

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(0, 220, 0, 0.6)";

        ctx.fillStyle = 'rgb(100, 220, 0)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#444';
        ctx.stroke();
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
    };


    proto.update = function(){
        var p = this.physics,
            pos = this.position,
            approach = util.approach,
            newX;

        p.velocity = approach(p.velocityGoal, p.velocity, 0.8);
        newX = pos.x + p.velocity;
        if ( newX >= this.canvas.width - this.size ) {
            pos.x = this.canvas.width - this.size;
        } else if ( newX <= 0 + this.size ) {
            pos.x = 0 + this.size;
        } else {
            pos.x = newX;
        }
    };


    return Player;

});
