define('spritePool', function(){

    'use strict';

    var registry = {},
        register,
        recycle
        ;

    function recycleFilter( obj ){
        return obj.destroyed === true;
    }


    register = function( name, item ){
        if ( typeof registry[name] === 'undefined' ) {
            registry[name] = [];
        }
        registry[name].push(item);
    };


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
