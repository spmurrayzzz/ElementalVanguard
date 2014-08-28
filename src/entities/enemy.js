define('Enemy',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    /**
     * Enemy constructor (extends Sprite)
     */
    function Enemy(){
        Sprite.apply(this, arguments);
        this.fillStyle = util.randomColor();
        this.size = 15;
        this.physics = {
            speed: 2,
            friction: 0.01,
            velocity: util.random(0.5, 1),
            velocityGoal: 0.1
        };
        this.orbitAt = 0;
        this.orbitSpeed = 3;
        this.inc = 0.2;
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size*2
        };
        this.displayProps = {
            // shadowBlur: 0,
            // shadowColor: 'rgba(221,113,8,1.0)'
        };
        this.gradients = {
            default: ['#800008', "#c3000b"],
            water: ['#255989', '#56b8ff'],
            air: ['#333', '#f1f1f1']
        };
        this.currentGradient = this.gradients.default;
        this.orbiterDisplayProps = { shadowBlur: 0 };
        this.effected = false;
    }

    proto = Enemy.prototype = Object.create(Sprite.prototype);


    /**
     * Creates the Enemy object in coordinate space, emits canvas event, and
     * sets any approprate elemental effects that may be active.
     * @param  {String} effect - "water"
     * @return {self}
     */
    proto.create = function( effect ){
        Sprite.prototype.create.call(this);
        this.setEffect(effect || null);
        return this;
    };


    /**
     * Binds all appropriate events to the Enemy, mostly how to react to
     * elemental effects.
     */
    proto.bindEvents = function(){
        Sprite.prototype.bindEvents.call(this);
        vent.on('elemental-water-on', this.waterEffect.bind(this, true));
        vent.on('elemental-air-on', this.airEffect.bind(this, true));
        vent.on('deactivate', this.deactivateAllEffects.bind(this));
        vent.on('elemental-fire-on', this.destroy.bind(this));
    };


    /**
     * Draw the Enemy object
     * @return {void}
     */
    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }

        var inc = 0.02,
            curr = inc*0.5,
            alpha = 0.9,
            grd;


        // Render primary body
        grd = this.ctx.createRadialGradient(
            this.position.x, this.position.y, this.size*1.5,
            this.position.x + 10, this.position.y + 10, this.size/2
        );
        grd.addColorStop(0, this.currentGradient[0]);
        grd.addColorStop(1, this.currentGradient[1]);
        util.circle(this.ctx,
            this.position.x, this.position.y, this.size, grd, this.displayProps
        );


        // Render orbiter
        this.orbitAt = this.orbitAt >= 2 ? 0 : this.orbitAt;
        this.orbitAt += inc * this.orbitSpeed;

        util.circle(this.ctx,
          this.position.x + (this.size + 2.5) * Math.cos(this.orbitAt * Math.PI),
          this.position.y + (this.size + 2.5) * Math.sin(this.orbitAt * Math.PI),
          5, 'rgba(221,113,8,1.0)', this.orbiterDisplayProps
        );

        // Render trail
        for (var i = 20; i > 0; i--) {
            util.circle(this.ctx,
              this.position.x + (this.size + i/4) * Math.cos((this.orbitAt-curr) * Math.PI),
              this.position.y + (this.size + i/4) * Math.sin((this.orbitAt-curr) * Math.PI),
              i/4, 'rgba(221, 113, 8, ' + alpha + ')'
            );
            curr += inc * 1;
            alpha -= inc * 0.6;
        }
    };


    /**
     * Updates the positional coordinates of the object before render
     * @return {void}
     */
    proto.update = function(){
        if ( this.destroyed ) {
            return;
        }

        if ( this.position.y + this.physics.velocity >
            this.canvas.height + this.size ) {

            this.destroy();
            vent.emit('enemy-passed');

        } else {
            this.position.y = this.position.y + this.physics.velocity;
        }
    };


    /**
     * Destroys the Enemy object, allowing for explosion effect to occur. Emits
     * event to let canvas know not to render the object.
     * @param  {Boolean} shouldExplode
     * @return {void}
     */
    proto.destroy = function( shouldExplode ){
        if ( shouldExplode === true ) {
            vent.emit('kaboom!', this.position.x, this.position.y);
        }
        this.position = { x: 0, y: 0 };
        this.destroyed = true;
        this.deactivateAllEffects();
        vent.emit('entity-destroyed', this);
    };


    /**
     * This method is invoked when the object is being picked out of the sprite
     * pool, the purpose of which is to move the item out of a destroyed state
     * so that it can be reused in the canvas space.
     * @return {void}
     */
    proto.recycle = function(){
        this.position.x = Math.random() * this.canvas.width;
        this.position.y = 0 - this.size;
        this.physics.velocityGoal = util.random(0.1, 0.5);
        this.destroyed = false;
        this.fillStyle = util.randomColor();
    };


    /**
     * Sets the appropriate elemental effect on the enemy, or in the absence of
     * a parameter, will unset all effects.
     *
     * Note: since water is the only effect that works on new enemies and this
     * is invoked during Enemy#create, this can only set water effects.
     *
     * @param {String} effect
     * @return {void}
     */
    proto.setEffect = function( effect ){
        if ( effect === 'water' ) {
            this.waterEffect(true);
        } else {
            this.deactivateAllEffects();
        }
    };


    /**
     * Activates or deactivates the water elemental effect.
     * @param {Boolean} activate
     * @return {void}
     */
    proto.waterEffect = function( activate ){
        this.effected = !!activate;
        if ( activate ) {
            this.currentGradient = this.gradients.water;
            this.physics.velocityGoal = this.physics.velocity * 0.3;
        } else {
            this.currentGradient = this.gradients.default;
            this.physics.velocityGoal = util.random(0.5, 1);
        }
    };


    /**
     * Activates or deactivates the air elemental effect
     * @param {Boolean} activate
     * @return {void}
     */
    proto.airEffect = function( activate ){
        this.effected = activate;
        if ( activate ) {
            this.currentGradient = this.gradients.air;
            this.physics.velocityGoal = 0;
        } else {
            this.currentGradient = this.gradients.default;
            this.physics.velocityGoal = util.random(0.5, 1);
        }
    };


    /**
     * Deactivates all elemental effects on the Enemy
     * @return {void}
     */
    proto.deactivateAllEffects = function(){
        this.waterEffect(false);
        this.airEffect(false);
    };


    return Enemy;

});
