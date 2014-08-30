define('Canvas',

['util', 'vent'],

function( util, vent ){

    'use strict';

    /**
     * Canvas constructor
     * (an OOP abstraction for several canvas layers)
     */
    function Canvas(){
        this.elems = util.QSA('canvas.m');
        this.ctx = [];
        for (var i = 0; i < this.elems.length; i++) {
            this.ctx.push(this.elems[i].getContext('2d'));
        }
        this.width = this.ctx[0].canvas.width;
        this.height = this.ctx[0].canvas.height;
        this.entityCache = [];
        this.laserCache = [];
        this.hudCache = [];
        this.bgCache = [];
        this.canvasCounter = 0;
        this.bindEvents();
    }

    var proto = Canvas.prototype;


    /**
     * Get the next canvas context in sequence
     * @return {Object}
     */
    proto.getNextContext = function(){
        var canvas = this.ctx[++this.canvasCounter];
        if ( this.canvasCounter >= this.ctx.length - 1 ) {
            this.canvasCounter = 0;
        }
        return canvas;
    };


    /**
     * Bind event handlers to global event emitter
     * @return {void}
     */
    proto.bindEvents = function(){
        vent.on('render', this.render.bind(this));
        vent.on('bg-item-added', this.addBGItem.bind(this));
        vent.on('entity-added', this.addSprite.bind(this));
        vent.on('entity-destroyed', this.destroySprite.bind(this));
        vent.on('laser-added', this.addLaser.bind(this));
        vent.on('laser-destroyed', this.destroyLaser.bind(this));
    };


    /**
     * `render` event handler - handles rendering of all background items, laser
     * items, and player/enemy entities.
     * @return {void}
     */
    proto.render = function( ){
        var i,
            ctx;

        for (i = 0; i < this.ctx.length; i++) {
            ctx = this.ctx[i];
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        for (i = 0; i < this.bgCache.length; i++) {
            this.bgCache[i].render();
        }
        for (i = 0; i < this.laserCache.length; i++) {
            this.laserCache[i].render();
        }
        for (i = 0; i < this.entityCache.length; i++) {
            this.entityCache[i].render();
        }
    };


    /**
     * Adds a Sprite item to the entity cache
     * @param {Sprite} sprite
     * @return {void}
     */
    proto.addSprite = function( sprite ){
        this.entityCache.push(sprite);
    };


    /**
     * Adds a Laser item to the laser cache and emits events for engine module
     * @param {Laser} sprite
     */
    proto.addLaser = function( sprite ){
        this.laserCache.push(sprite);
        vent.emit('laser-cache-updated', this.laserCache);
    };


    /**
     * Removes a Laser item matching its guid from the laserCache
     * @param {Laser} sprite
     * @return {void}
     */
    proto.destroyLaser = function( sprite ) {
        var spliceTargets = [],
            laser,
            i;

        for (i = 0; i < this.laserCache.length; i++) {
            laser = this.laserCache[i];
            if ( laser.id === sprite.id ) {
                spliceTargets.push(i);
            }
        }

        for (i = 0; i < spliceTargets.length; i++) {
            this.laserCache.splice(spliceTargets[i], 1);
        }
    };


    /**
     * Removes a Sprite item matching its guid from the entityCache
     * @param {Sprite} sprite
     * @return {void}
     */
    proto.destroySprite = function( sprite ) {
        var entity;

        for (var i = 0; i < this.entityCache.length; i++) {
            entity = this.entityCache[i];
            if ( entity.id === sprite.id ) {
                return this.entityCache.splice(i, 1);
            }
        }
    };


    /**
     * Adds a background item to background entity cache
     * @param {Sprite} sprite
     * @return {void}
     */
    proto.addBGItem = function( sprite ){
        this.bgCache.push(sprite);
    };


    return Canvas;

});
