define('Player',

['Sprite', 'vent', 'Laser', 'util', 'spritePool'],

function( Sprite, vent, Laser, util, pool ){

    'use strict';

    var proto;

    function Player(){
        Sprite.apply(this, arguments);
        this.ctx.fillStyle = "rgb(200,0,0)";
        this.size = 40;
        this.dims = {
            width: 60,
            height: 60
        };
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
        this.fillStyle = {
            default: 'rgba(120, 220, 0, 1)',
            fire: '#df4400'
        };
        this.currentFillStyle = this.fillStyle.default;
        this.displayProps = {
            default: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 40,
                shadowColor: 'rgba(0, 220, 0, 0.6)',
                lineWidth: 10,
                strokeStyle: 'rgba(0, 100, 0, 0.7)'
            },
            fire: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 40,
                shadowColor: '#df4400',
                lineWidth: 10,
                strokeStyle: '#df4400'
            }
        };
        this.currentDisplayProps = this.displayProps.default;
        this.pointerData = {
            x: 0,
            y: 0
        };
        this.laserPosition = { x: 0, y: 0 };
    }

    proto = Player.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        this.position = {
            x: this.canvas.width/2 - this.dims.width/2,
            y: this.canvas.height - 75
        };
        this.isCreated = true;
        vent.on('keydown', this.move.bind(this));
        vent.on('keyup', this.stop.bind(this));
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 32 ) {
                this.fire( ev );
            }
        }.bind(this));
        Sprite.prototype.create.call(this);
    };


    proto.bindEvents = function(){
        Sprite.prototype.bindEvents.call(this);
        vent.on('elemental-fire-on', function(){
            this.currentFillStyle = this.fillStyle.fire;
            this.currentDisplayProps = this.displayProps.fire;
        }.bind(this));
        vent.on('elemental-fire-off', function(){
            this.currentFillStyle = this.fillStyle.default;
            this.currentDisplayProps = this.displayProps.default;
        }.bind(this));
    };


    proto.render = function(){
        if ( !this.isCreated ) {
            return false;
        }

        // util.circle(
        //     this.ctx, this.position.x, this.position.y, this.size,
        //     this.currentFillStyle, this.currentDisplayProps
        // );
        this.ctx.drawImage(util.getById('player-img'),
            this.position.x, this.position.y, this.dims.width, this.dims.height
        );

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
            pos = this.laserPosition;

        this.laserPosition.x = this.position.x + 32;
        this.laserPosition.y = this.position.y - 15;

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
          this.canvas.width - this.dims.width ) {
            this.position.x = this.canvas.width - this.dims.width;
        } else if ( this.position.x + this.physics.velocity <= 0 ) {
            this.position.x = 0;
        } else {
            this.position.x = this.position.x + this.physics.velocity;
        }
    };


    return Player;

});
