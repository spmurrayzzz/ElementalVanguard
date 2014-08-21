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
            y: 0 - this.size*2
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
            curr = inc*0.5,
            alpha = 0.9,
            grd;


        // Render primary body
        grd=this.ctx.createRadialGradient(
            this.position.x, this.position.y, this.size*1.5,
            this.position.x + 20, this.position.y + 20, this.size/2
        );
        grd.addColorStop(0,"#800008");
        grd.addColorStop(1,"#c3000b");
        util.circle(this.ctx,
            this.position.x, this.position.y, this.size, grd, {
                shadowBlur: 40,
                shadowColor: 'rgba(221,113,8,1.0)'
            }
        );


        // Render orbiter
        this.orbitAt += this.inc*1.2;

        util.circle(this.ctx,
          this.position.x + (this.size + 5) * Math.cos(this.orbitAt),
          this.position.y + (this.size + 5) * Math.sin(this.orbitAt),
          5, 'rgba(221,113,8,1.0)', { shadowBlur: 0 }
        );

        // Render trail
        for (var i = 20; i > 0; i--) {
            util.circle(this.ctx,
              this.position.x + (this.size + i/4) * Math.cos(this.orbitAt-curr),
              this.position.y + (this.size + i/4) * Math.sin(this.orbitAt-curr),
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
