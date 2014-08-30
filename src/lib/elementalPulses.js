define('elementalPulse',

['vent', 'Asteroid', 'util'],

function( vent, Asteroid, util ){

    'use strict';

    var bindEvents,
        canvas,
        earth,
        keyHandler,
        check = {},
        refCache,
        deactivateTimedEffect,
        activateTimedEffect,
        checkCreator,
        ready,
        effectActive = false;


    /**
     * This object will store context-bound references of elemental effect check
     * handlers
     */
    refCache = {
        checkAir: null,
        checkWater: null,
        checkFire: null
    };


    /**
     * Bind event handlers for this module
     * @return {void}
     */
    bindEvents = function(){
        vent.on('start', function( game ){
            canvas = game.canvas;
            ready = false;
            vent.on('keydown', keyHandler);
            vent.on('cooldown-end', function(){
                ready = true;
            });
        });
    };


    /**
     * Handler function for `keydown` events
     * @param {Event} ev
     * @return {void}
     */
    keyHandler = function( ev ){
        if ( effectActive || !ready ) {
            return;
        }

        switch ( ev.keyCode ) {
            case 49:
                earth();
                break;
            case 50:
                activateTimedEffect('water', 'checkWater');
                break;
            case 51:
                activateTimedEffect('air', 'checkAir');
                break;
            case 52:
                activateTimedEffect('fire', 'checkFire');
                break;
            default:
                break;
        }
    };


    /**
     * Deactivate the named elemental pulse, this unbinds the correlating
     * check function from the `update` event and dispatches deactivation
     * events.
     *
     * @param {String} name
     * @param {String} checkFuncName
     * @return {void}
     */
    deactivateTimedEffect = function( name, checkFuncName ) {
        vent.off('update', refCache[checkFuncName]);
        vent.emit('deactivate ' + name + '-off');
        refCache[checkFuncName] = null;
        effectActive = false;
    };


    /**
     * Activate the named elemental pulse, which should bind a check function
     * to the `update` event and dispatch activation signals.
     *
     * @param {String} name
     * @param {Function} checkFuncName
     * @return {void}
     */
    activateTimedEffect = function( name, checkFuncName ){
        if ( effectActive ) {
            return;
        }
        var started = Date.now();
        vent.emit('activate elemental-' + name + '-on', name);
        refCache[checkFuncName] = check[name].bind(null, started);
        vent.on('update', refCache[checkFuncName]);
        effectActive = true;
        ready = false;
    };


    /**
     * Kick off the earth elemental pulse. Flings randomly sized asteroids
     * towards the field of enemies.
     *
     * @return {void}
     */
    earth = function(){
        var objCount = 5,
            x = canvas.width/objCount,
            currX = x - x/2;

        for (var i = 0; i < objCount; i++) {
            new Asteroid(canvas).create(currX);
            currX += x;
        }
        vent.emit('activate elemental-earth', 'earth');
        ready = false;
    };


    /**
     * Builds and returns a check function used to test whether to deactivate
     * a given elemental pulse effect.
     *
     * @param {String} name
     * @param {Integer} time  in milliseconds
     * @return {Function}
     */
    checkCreator = function( name, time ){
        var capName = util.capitalize(name);
        return function( startTime ){
            var now = Date.now();
            vent.emit('elemental-progress', (now - startTime) / time);
            if ( now - startTime > time ) {
                deactivateTimedEffect('elemental-' + name, 'check' + capName);
            }
        };
    };


    /**
     * Check function binding
     */

    check.water = checkCreator('water', 10e3);
    check.air = checkCreator('air', 10e3);
    check.fire = checkCreator('fire', 10e3);


    bindEvents();

});
