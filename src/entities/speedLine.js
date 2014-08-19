define('SpeedLine',

['Sprite', 'vent', 'util'],

function( Sprite ){

    'use strict';

    var proto;

    function SpeedLine(){
        Sprite.apply(this, arguments);
        this.size = {
            width: 1,
            height: 20
        };
        this.isCreated = false;
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: Math.random() * (10 - 6) + 6
        };
        this.fillStyle = 'rgba(255,255,255,0.15)';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size.height
        };
    }

    proto = SpeedLine.prototype = Object.create(Sprite.prototype);


    proto.bindEvents = function(){};


    proto.create = function(){ return this; };


    proto.restart = function(){
        this.position = {
            x: Math.random() * this.canvas.width,
            y: -10
        };
    };

    return SpeedLine;

});
