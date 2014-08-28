define('Player',

['Sprite', 'vent', 'Laser', 'util', 'spritePool'],

function( Sprite, vent, Laser, util, pool ){

    'use strict';

    var proto;

    /**
     * Player constructor (extends Sprite)
     */
    function Player(){
        Sprite.apply(this, arguments);
        this.ctx = this.canvas.ctx[this.canvas.ctx.length-1];
        this.dims = {
            width: 30,
            height: 30
        };
        this.physics = {
            speed: 2,
            friction: 0.98,
            velocity: 0,
            velocityGoal: 0
        };
        this.keyPressed = false;
        this.lastFired = new Date().getTime();
        this.laserPosition = { x: 0, y: 0 };
        this.img = util.getById('player-img');
    }

    proto = Player.prototype = Object.create(Sprite.prototype);


    /**
     * Creates the player in entity space, and binds the events needed for
     * movement
     * @return {void}
     */
    proto.create = function(){
        this.position = {
            x: this.ctx.canvas.width/2 - this.dims.width/2,
            y: this.ctx.canvas.height - 37
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
        vent.emit('player-added', this);
    };


    /**
     * Binds all other effects not related to movement of player
     * @return {void}
     */
    proto.bindEvents = function(){
        Sprite.prototype.bindEvents.call(this);
        vent.on('elemental-fire-on', function(){
            this.fireActive = true;
        }.bind(this));
        vent.on('elemental-fire-off', function(){
            this.fireActive = false;
        }.bind(this));
    };


    /**
     * Draws the player to canvas during `render` events
     * @return {void}
     */
    proto.render = function(){
        this.ctx.shadowBlur = 0;
        this.ctx.drawImage(this.img,
            this.position.x, this.position.y, this.dims.width, this.dims.height
        );
    };


    /**
     * Event handler for key presses, intent is to move the player. Result is a
     * change in the x velocityGoal value for the player.
     * @param  {Event} ev
     * @return {void}
     */
    proto.move = function( ev ){
        if ( this.keyPressed ) {
            return;
        }

        var regex = /^(37|39)/g,
            key = ev.keyCode;

        if ( !regex.test(key) ) {
            return;
        }

        this.physics.velocityGoal = key === 37 ? -6 : 6;
        this.keyPressed = true;
    };


    /**
     * Stops all player movement, reduces velocityGoal to zero.
     * @param  {Event} ev
     * @return {void}
     */
    proto.stop = function( ev ){
        var regex = /^(37|39)/g,
            key = ev.keyCode;

        if ( !regex.test(key) ) {
            return;
        }

        this.physics.velocityGoal = 0;
        this.keyPressed = false;
    };


    /**
     * Fires a Laser projectile from the front of the vessel
     * @return {void}
     */
    proto.fire = function(){
        if ( this.lastFired > new Date().getTime() - 200 ) {
            return;
        }

        var laser = pool.recycle('lasers'),
            pos = this.laserPosition;

        this.laserPosition.x = this.position.x + 16;
        this.laserPosition.y = this.position.y;

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


    /**
     * Method invokved during `update` events to update player positional
     * coordinates, velocity, and whether to emit the elemental fire effect.
     * @return {void}
     */
    proto.update = function(){
        this.physics.velocity = util.approach(
          this.physics.velocityGoal, this.physics.velocity, 0.4
        );

        if ( this.position.x + this.physics.velocity >=
          this.canvas.width - this.dims.width ) {
            this.position.x = this.canvas.width - this.dims.width;
        } else if ( this.position.x + this.physics.velocity <= 0 ) {
            this.position.x = 0;
        } else {
            this.position.x = this.position.x + this.physics.velocity;
        }
        if ( this.fireActive ) {
            vent.emit('emit-fire',
                this.position.x + this.dims.width/2,
                this.position.y + this.dims.height/2
            );
        }
    };


    /**
     * Destroys the player and ends the game.
     * @return {void}
     */
    proto.destroy = function(){
        this.destroyed = true;
        vent.emit('entity-destroyed', this);
        vent.emit('kaboom!', this.position.x, this.position.y);
    };


    return Player;

});
