define('SpeedLine',

['Sprite', 'vent', 'util'],

function( Sprite ){

    'use strict';

    var proto;

    /**
     * Speedline constructor (extends Sprite)
     */
    function SpeedLine(){
        Sprite.apply(this, arguments);
        this.size = {
            width: 1,
            height: 20
        };
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


    /**
     * No-op to override Sprite#bindEvents
     */
    proto.bindEvents = function(){};


    /**
     * No-op to override Sprite#create
     * @return {self}
     */
    proto.create = function(){ return this; };


    /**
     * Resets the SpeedLine object's position in the coordinate space
     * @return {void}
     */
    proto.restart = function(){
        this.position.x = Math.random() * this.canvas.width;
        this.position.y = -10;
    };

    return SpeedLine;

});
