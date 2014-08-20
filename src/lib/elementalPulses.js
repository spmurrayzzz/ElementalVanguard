define('elementalPulse',

['vent', 'Asteroid'],

function( vent, Asteroid ){

    var bindEvents,
        canvas,
        earth;


    bindEvents = function(){
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 49) {
                earth();
            }
        });
        vent.on('start', function( game ){
            canvas = game.canvas;
        });
    };


    earth = function(){
        var objCount = 5,
            x = canvas.width/objCount,
            currX = x - x/2;

        for (var i = 0; i < objCount; i++) {
            new Asteroid(canvas).create(currX);
            currX += x;
        }

    };


    bindEvents();

});
