define('gameLoop',

['vent'],

function( vent ){

    'use strict';

    var raf = window.requestAnimationFrame,
        paused = false;

    function step(){
        if ( !paused ) {
            vent.emit('update');
            vent.emit('render');
            vent.emit('debug');
        }
        raf(step);
    }

    vent.on('start', step);
    vent.on('keydown', function( ev ){
        if ( ev.keyCode === 80 ) {
            paused = !paused;
        }
    });
    vent.on('pause', function(){
        paused = !paused;
    });

});
