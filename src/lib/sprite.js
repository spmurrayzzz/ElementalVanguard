define('Sprite',

['vent', 'util'],

function( vent, util ){

    'use strict';

    var proto;

    /**
     * Sprite constructor (not to be used directly, should be extended)
     * @param {Canvas} canvas
     */
    function Sprite( canvas ){
        if ( canvas === undefined ) {
            throw new Error('Sprites require a canvas context');
        }
        this.canvas = canvas;
        if ( canvas.ctx && canvas.ctx.length ) {
            this.ctx = canvas.getNextContext();
        }
        this.position = { x: 0, y: 0 };
        this.size = { width: 50, height: 50 };
        this.id = util.guid();
        this.bindEvents();
    }

    proto = Sprite.prototype;


    /**
     * Binds event handlers to global event emitter
     */
    proto.bindEvents = function(){
        var self = this;
        vent.on('create', function( game ){
            self.create.call(self, game);
        });
        vent.on('update', this.update.bind(this));
    };


    /**
     * Adds the entity to the canvas coordinate space
     * @return {self}
     */
    proto.create = function(){
        vent.emit('entity-added', this);
        return this;
    };


    return Sprite;
});
