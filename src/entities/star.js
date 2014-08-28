define('Star',

['Sprite', 'util', 'vent'],

function( Sprite, util ){

    'use strict';

    var proto;

    /**
     * Star constructor (extends Sprite)
     */
    function Star(){
        Sprite.apply(this, arguments);
        this.size = util.random(0.1, 1);
        this.physics = {
            speed: 2,
            friction: 2,
            velocity: 0,
            velocityGoal: util.random(0.5, 3.5)
        };
        this.fillStyle = 'rgba(241,241,241,' +
            util.random(0.1, 0.4) + ')';
        this.position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.size
        };
    }

    proto = Star.prototype = Object.create(Sprite.prototype);


    /**
     * No-op to override Sprite#create
     * @return {self}
     */
    proto.create = function(){ return this; };


    /**
     * No-op to override Sprite#bindEvents
     * @return {void}
     */
    proto.bindEvents = function(){};


    /**
     * Resets the Star object's position in coordinate space
     * @return {void}
     */
    proto.restart = function(){
        this.position.x = Math.random() * this.canvas.width;
        this.position.y = -10;
    };

    return Star;

});
