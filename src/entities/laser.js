define('Laser',

['Sprite', 'util', 'vent'],

function( Sprite, util, vent ){

    'use strict';

    var proto;

    /**
     * Laser constructor (extends Sprite)
     */
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


    /**
     * Creates the Laser object in entity space and fires an event which the
     * canvas and game engine can subscribe to for collision detection,
     * rendering, etc.
     * @param  {obkect} opts
     * @return {self}
     */
    proto.create = function( opts ){
        this.position.x = opts.x;
        this.position.y = opts.y;
        vent.emit('laser-added', this);
        return this;
    };


    /**
     * Method invoked for `render` events, draws the Laser object
     * @return {void}
     */
    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }
        var pos = this.position;
        util.circle(this.ctx, pos.x, pos.y, this.size, util.randomColor(),
            this.displayProps
        );
    };


    /**
     * Method invoked for `update` events, updates positional coordinates
     * @return {void}
     */
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


    /**
     * Destroys the Laser object and emits events for engine and canvas
     * @return {void}
     */
    proto.destroy = function(){
        this.position.x = 0;
        this.position.y = 0;
        this.destroyed = true;
        vent.emit('laser-destroyed', this);
    };

    return Laser;

});
