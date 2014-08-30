define('gameLoop',

['vent'],

function( vent ){

    'use strict';

    var raf = window.requestAnimationFrame,
        paused = false;

    /**
     * Primary game frame tick, emit global events
     * @return {void}
     */
    function step(){
        if ( !paused ) {
            vent.emit('update');
            vent.emit('render');
            vent.emit('debug');
        }
        raf(step);
    }

    vent.on('start', step);
    vent.on('pause', function(){
        paused = !paused;
    });

});
