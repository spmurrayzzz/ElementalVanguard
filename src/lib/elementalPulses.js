define('elementalPulse',

['vent', 'Asteroid'],

function( vent, Asteroid ){

    var bindEvents,
        canvas,
        earth,
        keyHandler,
        check = {},
        refCache,
        deactivateTimedEffect,
        activateTimedEffect,
        effectActive = false;


    refCache = {
        checkAir: null,
        checkWater: null,
        checkFire: null
    };


    bindEvents = function(){
        vent.on('start', function( game ){
            canvas = game.canvas;
            vent.on('keydown', keyHandler);
        });
    };


    keyHandler = function( ev ){
        if ( effectActive ) {
            return;
        }
        switch ( ev.keyCode ) {
            case 49:
                earth();
                break;
            case 50:
                activateTimedEffect('elemental-water', 'checkWater');
                break;
            case 51:
                activateTimedEffect('elemental-air', 'checkAir');
                break;
            case 52:
                activateTimedEffect('elemental-fire', 'checkFire');
                break;
            default:
                break;
        }
    };


    deactivateTimedEffect = function( name, checkFuncName ) {
        vent.off('update', refCache[checkFuncName]);
        vent.emit('deactivate ' + name + '-off');
        refCache[checkFuncName] = null;
        effectActive = false;
        console.log(refCache);
    };


    activateTimedEffect = function( name, checkFuncName ){
        if ( effectActive ) {
            return;
        }
        var started = new Date().getTime(),
            shortName = name.split('-')[1];

        vent.emit('activate ' + name + '-on', shortName);
        refCache[checkFuncName] = check[shortName].bind(null, started);
        vent.on('update', refCache[checkFuncName]);
        effectActive = true;
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


    check.water = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 6e3 ) {
            deactivateTimedEffect('elemental-water', 'checkWater');
        }
    };


    check.air = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 10e3 ) {
            deactivateTimedEffect('elemental-air', 'checkAir');
        }
    };


    check.fire = function( startTime ){
        var now = new Date().getTime();
        if ( now - startTime > 10e3 ) {
            deactivateTimedEffect('elemental-fire', 'checkFire');
        }
    };


    bindEvents();

});
