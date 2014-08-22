define('Enemy',

['Sprite', 'vent', 'util'],

function( Sprite, vent, util ){

    'use strict';

    var proto;

    function Enemy(){
        Sprite.apply(this, arguments);
        this.fillStyle = util.randomColor();
        this.size = 30;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: util.random(1, 2)
        };
        this.orbiter = {
            physics: {
                friction: 2,
                velocity: 1,
                velocityGoal: 1
            },
            current: {
                x: 0,
                y: 0
            }
        };
        this.orbitAt = 0;
        this.orbitSpeed = 3;
        this.inc = 0.2;
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size*2
        };
        this.displayProps = {
            shadowBlur: 40,
            shadowColor: 'rgba(221,113,8,1.0)'
        };
        this.gradients = {
            default: ['#800008', "#c3000b"],
            water: ['#255989', '#56b8ff']
        };
        this.currentGradient = this.gradients.default;
        this.orbiterDisplayProps = { shadowBlur: 0 };
    }

    proto = Enemy.prototype = Object.create(Sprite.prototype);


    proto.create = function( effect ){
        Sprite.prototype.create.call(this);
        this.setEffect(effect || null);
        return this;
    };


    proto.bindEvents = function(){
        Sprite.prototype.bindEvents.call(this);
        vent.on('elemental-water-on', this.waterEffect.bind(this, true));
        vent.on('elemental-water-off', this.deactivateAllEffects.bind(this));
    };


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
            this.position.x + 20, this.position.y + 20, this.size/2
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
          this.position.x + (this.size + 5) * Math.cos(this.orbitAt * Math.PI),
          this.position.y + (this.size + 5) * Math.sin(this.orbitAt * Math.PI),
          5, 'rgba(221,113,8,1.0)', this.orbiterDisplayProps
        );

        // Render trail
        for (var i = 20; i > 0; i--) {
            util.circle(this.ctx,
              this.position.x + (this.size + i/4) * Math.cos((this.orbitAt-curr) * Math.PI),
              this.position.y + (this.size + i/4) * Math.sin((this.orbitAt-curr) * Math.PI),
              i/4, 'rgba(221, 113, 8, ' + alpha + ')'
            );
            curr += inc * 0.5;
            alpha -= inc * 0.3;
        }
    };


    proto.update = function(){
        if ( this.destroyed ) {
            return;
        }

        this.physics.velocity = util.approach(
          this.physics.velocityGoal,
          this.physics.velocity,
          this.physics.friction
        );

        if ( this.position.y + this.physics.velocity >
          this.canvas.height + this.size ) {
            this.destroy();
        } else {
            this.position.y = this.position.y + this.physics.velocity;
        }
    };


    proto.destroy = function(){
        this.position = { x: 0, y: 0 };
        this.destroyed = true;
        this.deactivateAllEffects();
        vent.emit('entity-destroyed', this);
    };


    proto.recycle = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size
        };
        this.physics.velocityGoal = util.random(1, 2);
        this.destroyed = false;
        this.fillStyle = util.randomColor();
    };


    proto.setEffect = function( effect ){
        if ( effect ) {
            switch (effect) {
                case 'water':
                    this.waterEffect(true);
                    break;
                default:
                    break;
            }
        }
    };


    proto.waterEffect = function( activate ){
        if ( activate ) {
            this.currentGradient = this.gradients.water;
            this.physics.velocityGoal = this.physics.velocityGoal * 0.3;
        } else {
            this.currentGradient = this.gradients.default;
            this.physics.velocityGoal = util.random(1, 2);
        }
    };


    proto.deactivateAllEffects = function(){
        this.waterEffect(false);
    };


    return Enemy;

});
