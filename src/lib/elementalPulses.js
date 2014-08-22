define('elementalPulse',

['vent', 'Asteroid'],

function( vent, Asteroid ){

    var bindEvents,
        canvas,
        water,
        checkWater,
        refCache,
        air,
        checkAir,
        fire,
        checkFire,
        earth,
        effectActive = false;


    refCache = {
        checkAir: null,
        checkWater: null,
        checkFire: null
    };


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
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 51) {
                air();
            }
        });
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 52) {
                fire();
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
        if ( effectActive ) {
            return;
        }
        var started = new Date().getTime();
        vent.emit('activate elemental-water-on',  'water');
        refCache.checkWater = checkWater.bind(null, started);
        vent.on('update', refCache.checkWater);
        effectActive = true;
    };


    checkWater = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 6e3 ) {
            vent.off('update', refCache.checkWater);
            vent.emit('deactivate elemental-water-off');
            refCache.checkWater = null;
            effectActive = false;
        }
    };


    air = function(){
        if ( effectActive ) {
            return;
        }
        var started = new Date().getTime();
        vent.emit('activate elemental-air-on',  'air');
        refCache.checkAir = checkAir.bind(null, started);
        vent.on('update', refCache.checkAir);
        effectActive = true;
    };


    checkAir = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 10e3 ) {
            vent.off('update', refCache.checkAir);
            vent.emit('deactivate elemental-air-off');
            refCache.checkAir = null;
            effectActive = false;
        }
    };


    fire = function(){
        if ( effectActive ) {
            return;
        }
        var started = new Date().getTime();
        vent.emit('activate elemental-fire-on',  'fire');
        refCache.checkFire = checkFire.bind(null, started);
        vent.on('update', refCache.checkFire);
        effectActive = true;
    };


    checkFire = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 10e3 ) {
            vent.off('update', refCache.checkFire);
            vent.emit('deactivate elemental-fire-off');
            refCache.checkFire = null;
            effectActive = false;
        }
    };


    bindEvents();

});
