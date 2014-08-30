define('spritePool', function(){

    'use strict';

    var registry = {},
        register,
        recycle
        ;

    /**
     * Filter method for testing whether items are recyclable
     * @param {Sprite} obj
     */
    function recycleFilter( obj ){
        return obj.destroyed === true;
    }


    /**
     * Add a generated entity to the sprite pool
     * @param  {String} name name of sprite pool
     * @param  {Sprite} item sprite item to add
     * @return {void}
     */
    register = function( name, item ){
        if ( typeof registry[name] === 'undefined' ) {
            registry[name] = [];
        }
        registry[name].push(item);
    };


    /**
     * Recycles a given sprite from the requested pool, otherwise returns false
     * @param  {String} name name of sprite pool
     * @return {Sprite|Boolean}
     */
    recycle = function( name ) {
        if ( typeof registry[name] === 'undefined' ) {
            registry[name] = [];
        }
        var destroyed = registry[name].filter(recycleFilter);

        if ( destroyed.length ) {
            if ( destroyed[0].recycle !== undefined ) {
                destroyed[0].recycle();
            }
            return destroyed[0];
        }

        return false;
    };


    return {
        register: register,
        recycle: recycle,
        _registry: registry
    };

});
