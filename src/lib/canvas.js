define('Canvas',

['util', 'vent'],

function( util, vent ){

    'use strict';

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


    proto.getNextContext = function(){
        var canvas = this.ctx[++this.canvasCounter];
        if ( this.canvasCounter >= this.ctx.length - 1 ) {
            this.canvasCounter = 0;
        }
        return canvas;
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


    proto.addSprite = function( sprite ){
        this.entityCache.push(sprite);
    };


    proto.addLaser = function( sprite ){
        this.laserCache.push(sprite);
        vent.emit('laser-cache-updated', this.laserCache);
    };


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


    proto.destroySprite = function( sprite ) {
        var entity;

        for (var i = 0; i < this.entityCache.length; i++) {
            entity = this.entityCache[i];
            if ( entity.id === sprite.id ) {
                return this.entityCache.splice(i, 1);
            }
        }
    };


    proto.addHUDItem = function(){

    };


    proto.addBGItem = function( sprite ){
        this.bgCache.push(sprite);
    };


    return Canvas;

});
