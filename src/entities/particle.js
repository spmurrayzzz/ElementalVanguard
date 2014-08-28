define('Particle',

['Sprite', 'util'],

function( Sprite, util ){

    'use strict';

    var proto;

    /**
     * Particle constructor (extends Sprite)
     * @param {Canvas} canvas
     * @param {Boolean} override - flag to set if props will be overridden
     */
    function Particle( canvas, override ){
        Sprite.apply(this, arguments);
        this.size = 2;
        this.physics = {
            speed: 0.5,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random()*3 + 2
        };

        this.direction = Math.random()*2*Math.PI;
        this.xInc = function(){
            return Math.cos(this.direction) * this.physics.velocity;
        };
        this.yInc = function(){
            return Math.sin(this.direction) * this.physics.velocity;
        };

        if ( !override ) {
            this.life = util.random(30, 50);
            this.fillStyle = 'rgba(244,0,8,' +
                Math.random() * ((1 - 0.5) + 0.5) + ')';
            this.position = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.size
            };
        }
        this.bindRefs = {};
    }

    proto = Particle.prototype = Object.create(Sprite.prototype);


    /**
     * Creates the Particle
     * @return {self}
     */
    proto.create = function(){
        return this;
    };


    /**
     * No-op to ensure the Sprite method doesn't get invoked
     */
    proto.bindEvents = function(){};


    /**
     * Method invoked during `update` events. Updates positional coordinates
     * and decreases life total incrementally.
     * @return {void}
     */
    proto.update = function(){
        this.physics.velocity = util.approach(
            this.physics.velocityGoal,
            this.physics.velocity,
            this.physics.friction
        );
        this.position.y += this.yInc();
        this.position.x += this.xInc();
        this.life--;
    };


    /**
     * Draws the Particle during `render` events
     * @return {void}
     */
    proto.render = function( ctx ){
        util.circle(ctx,
            this.position.x, this.position.y, this.size, this.fillStyle
        );
    };


    /**
     * Method invoked when recycling this item from a spritePool instance
     * @return {void}
     */
    proto.recycle = function(){
        this.destroyed = false;
    };


    return Particle;

});
