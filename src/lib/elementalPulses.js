define('elementalPulse',

['vent', 'Asteroid'],

function( vent, Asteroid ){

    var bindEvents,
        canvas,
        water,
        earth;


    bindEvents = function(){
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 49) {
                earth();
            }
        });

        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 50) {
                water();
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
        vent.emit('activate elemental-earth', 'earth');
    };


    water = function(){
        vent.emit('activate elemental-water-on',  'water');
    };


    bindEvents();

});
