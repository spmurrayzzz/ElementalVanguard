define('Star',

['Sprite', 'util', 'vent'],

function( Sprite, util ){

    'use strict';

    var proto;

    function Star(){
        Sprite.apply(this, arguments);
        this.size = util.random(0.3, 2);
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: util.random(1, 6)
        };
        this.fillStyle = 'rgba(241,241,241,' +
            util.random(0.1, 0.4) + ')';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size
        };
    }

    proto = Star.prototype = Object.create(Sprite.prototype);


    proto.create = function(){ return this; };


    proto.bindEvents = function(){};


    proto.restart = function(){
        this.position.x = Math.random() * this.canvas.width;
        this.position.y = -10;
    };

    return Star;

});
