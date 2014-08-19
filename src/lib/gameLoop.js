define('gameLoop',

['vent'],

function( vent ){

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

});
