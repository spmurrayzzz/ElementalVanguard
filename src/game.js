define('game',

['Canvas', 'Player', 'vent'],

function( Canvas, Player, vent ){

    'use strict';

    var canvas,
        player,
        game;

    canvas = new Canvas('game-container', {
        width: 800,
        height: 600,
        bgColor: "#000"
    });

    player = new Player(canvas);

    game = {
        canvas: canvas,
        player: player
    };

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

    window.game = game;

    return game;

});
