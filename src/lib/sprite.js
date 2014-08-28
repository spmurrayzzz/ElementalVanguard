define('Sprite',

['vent', 'util'],

function( vent, util ){

    'use strict';

    var proto;

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


    proto.bindEvents = function(){
        var self = this;
        vent.on('create', function( game ){
            self.create.call(self, game);
        });
        vent.on('update', this.update.bind(this));
    };


    proto.create = function(){
        vent.emit('entity-added', this);
        return this;
    };


    proto.render = function(){};


    proto.update = function(){};


    proto.destroy = function(){
        vent.emit(this.id + '-destroy');
    };


    proto.onDestroy = function( cb ){
        vent.on(this.id + '-destroy', cb);
    };


    return Sprite;
});
