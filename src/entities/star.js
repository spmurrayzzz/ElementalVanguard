define('Star',

['Sprite', 'vent', 'util'],

function( Sprite ){

    'use strict';

    var proto;

    function Star(){
        Sprite.apply(this, arguments);
        this.size = Math.random() * (1.4 - 0.3) + 0.3;
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random() * (6 - 1) + 1
        };
        this.fillStyle = 'rgba(241,241,241,' +
            Math.random() * ((0.8 - 0.3) + 0.3) + ')';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size
        };
    }

    proto = Star.prototype = Object.create(Sprite.prototype);


    proto.create = function(){ return this; };


    proto.bindEvents = function(){};


    proto.restart = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: -10
        };
    };

    return Star;

});
