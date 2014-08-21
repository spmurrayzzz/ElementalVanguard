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
            velocityGoal: Math.random() * (2 - 1) + 1
        };
        this.orbiter = {
            physics: {
                friction: 2,
                velocity: 1,
                velocityGoal: Math.random() * (2 - 1) + 1
            },
            current: {
                x: 0,
                y: 0
            }
        };
        this.orbitAt = 0;
        this.inc = 0.2;
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size
        };
    }

    proto = Enemy.prototype = Object.create(Sprite.prototype);


    proto.create = function(){
        Sprite.prototype.create.call(this);
        return this;
    };


    proto.render = function(){
        if ( this.destroyed ) {
            return;
        }

        var inc = 0.3,
            curr = inc,
            alpha = 0.9;


        // Render primary body
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowColor = 'rgba(241, 241, 241, 1)';

        this.ctx.fillStyle = 'rgba(241, 241, 241, 1)';
        this.ctx.beginPath();
        this.ctx.arc(
          this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false
        );
        this.ctx.fill();


        // Render orbiter
        this.orbitAt += this.inc;

        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        this.ctx.beginPath();
        this.ctx.arc(
          this.position.x + (this.size + 5) * Math.cos(this.orbitAt),
          this.position.y + (this.size + 5) * Math.sin(this.orbitAt),
          5, 0, 2 * Math.PI, false
        );
        this.ctx.fill();

        // Render trail
        for (var i = 0; i < 5; i++) {
            this.ctx.fillStyle = 'rgba(230, 0, 0, ' + alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(
              this.position.x + (this.size + 5) * Math.cos(this.orbitAt-curr),
              this.position.y + (this.size + 5) * Math.sin(this.orbitAt-curr),
              5, 0, 2 * Math.PI, false
            );
            this.ctx.fill();
            curr += inc;
            alpha -= inc + inc*0.5;
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
        vent.emit('entity-destroyed', this);
    };


    proto.recycle = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: 0 - this.size
        };
        this.physics.velocityGoal = Math.random() * (2 - 1) + 1;
        this.destroyed = false;
        this.fillStyle = util.randomColor();
        vent.emit('entity-added', this);
    };

    return Enemy;

});
