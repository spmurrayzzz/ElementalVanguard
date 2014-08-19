define('game',

['Canvas', 'Player', 'vent', 'util'],

function( Canvas, Player, vent, util ){

    'use strict';

    var canvas,
        player,
        bgCanvas,
        game;

    bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'bg-canvas';
    bgCanvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    util.getById('game-container').appendChild(bgCanvas);

    canvas = new Canvas('game-container', {
        width: window.innerWidth,
        height: window.innerHeight,
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
