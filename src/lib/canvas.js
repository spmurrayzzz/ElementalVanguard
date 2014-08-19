define('Canvas',

['util', 'vent'],

function( util, vent ){

    'use strict';

    function Canvas( targetId, opts ){
        this.parent = util.getById(targetId);
        if ( this.parent === null ) {
            throw new Error('Need a valid canvas container target');
        }
        this.elem = document.createElement('canvas');
        this.elem.id = 'game-canvas';
        this.elem.style.border = "1px solid #333";
        this.parent.appendChild(this.elem);
        this.ctx = this.elem.getContext('2d');

        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d');

        if ( opts !== undefined ) {
            this.height = this.elem.height = opts.height;
            this.width = this.elem.width = opts.width;
            this.bgColor = opts.bgColor;
        }

        this.entityCache = [];
        this.laserCache = [];
        this.hudCache = [];
        this.bgCache = [];
        this.bindEvents();
    }

    var proto = Canvas.prototype;


    proto.get = function( attr ){
        return this.elem.getAttribute(attr);
    };


    proto.bindEvents = function(){
        vent.on('render', this.render.bind(this));
        vent.on('bg-item-added', this.addBGItem.bind(this));
        vent.on('entity-added', this.addSprite.bind(this));
        vent.on('entity-destroyed', this.destroySprite.bind(this));
        vent.on('laser-added', this.addLaser.bind(this));
        vent.on('laser-destroyed', this.destroyLaser.bind(this));
        vent.on('hud-item-added', this.addHUDItem.bind(this));
    };


    proto.render = function( ){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.bgCache.forEach(function( sprite ){
            sprite.render();
        });
        this.laserCache.forEach(function( sprite ){
            sprite.render();
        });
        this.entityCache.forEach(function( sprite ){
            sprite.render();
        });
    };


    proto.addSprite = function( sprite ){
        this.entityCache.push(sprite);
    };


    proto.addLaser = function( sprite ){
        this.laserCache.push(sprite);
    };


    proto.destroyLaser = function( sprite ) {
        var target;
        this.laserCache.forEach(function( obj, key ){
            if ( obj.id === sprite.id ) {
                target = key;
            }
        });
        this.laserCache.splice(target, 1);
    };


    proto.destroySprite = function( sprite ) {
        var target;
        this.entityCache.forEach(function( obj, key ){
            if ( obj.id === sprite.id ) {
                target = key;
            }
        });
        this.entityCache.splice(target, 1);
    };


    proto.addHUDItem = function(){

    };


    proto.addBGItem = function( sprite){
        this.bgCache.push(sprite);
    };


    return Canvas;

});