/**
 * game.js
 *
 * This module houses the high-level instantiation and event binding for the
 * entire game. If interfaces need to be exposes to the global scope or parent
 * namespace, it should be done so in this module.
 */

define('game',

['Canvas', 'Player', 'vent', 'util'],

function( Canvas, Player, vent, util ){

    'use strict';

    var canvas,
        player,
        bgCanvas,
        game;

    // Create the background canvas used for the starfield effect
    //   -- this is mostly being utlized for a performance boost
    bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'bg-canvas';
    bgCanvas.height = 600;
    bgCanvas.width = 800;
    util.getById('game-container').appendChild(bgCanvas);

    // Create the canvas stage that we'll be using for primary game entities
    canvas = new Canvas('game-container', {
        width: 800,
        height: 600,
        bgColor: "#000"
    });

    // Create the player entity
    player = new Player(canvas);

    // Create an object we can expose as an interface for debugging
    // (modules shouldn't be touch this object)
    game = {
        canvas: canvas,
        player: player
    };

    // Couple DOM events to our custom event emitter
    document.addEventListener('keydown', function( ev ){
        vent.emit('keydown', ev);
    });
    document.addEventListener('keyup', function( ev ){
        vent.emit('keyup', ev);
    });
    document.addEventListener('DOMContentLoaded', function(){
        vent.emit('create', game);
        vent.emit('start', game);
    });
    util.getById('game-container').addEventListener('mousemove', function( ev ){
        vent.emit('mousemove', ev, canvas.elem);
    });
    document.addEventListener('click', function( ev ){
        vent.emit('click', ev);
    });

    // Expose the interface
    window.game = game;

    return game;

});
