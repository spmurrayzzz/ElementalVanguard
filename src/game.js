/**
 * game.js
 *
 * This module houses the high-level instantiation and event binding for the
 * entire game. If interfaces need to be exposes to the global scope or parent
 * namespace, it should be done so in this module.
 */

define('game',

['Canvas', 'Player', 'vent'],

function( Canvas, Player, vent ){

    'use strict';

    var canvas,
        player,
        game;

    // Create the canvas stage that we'll be using for primary game entities
    canvas = new Canvas();

    // Create the player entity
    player = new Player(canvas);

    // Create an object we can expose as an interface for debugging
    // (modules shouldn't be touch this object)
    game = {
        canvas: canvas,
        player: player,
        vent: vent
    };

    document.addEventListener('keydown', function( ev ){
        vent.emit('keydown', ev);
    });
    document.addEventListener('keyup', function( ev ){
        vent.emit('keyup', ev);
    });

    // Couple DOM events to our custom event emitter
    document.addEventListener('DOMContentLoaded', function(){
        vent.emit('create', game);
        vent.emit('start', game);
    });

    vent.on('game-over', function( submsg ){
        vent.emit(
            'message',
            'Game Over',
            submsg + '<br/><br/> Press \'R\' to try again.'
        );
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 82 ){
                window.location.href = window.location.href;
            }
        });
    });

    // Expose the interface
    window.game = game;

    return game;

});
