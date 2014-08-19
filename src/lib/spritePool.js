define('spritePool', function(){

    var registry = {},
        register,
        recycle
        ;

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
        var destroyed = registry[name].filter(function( obj ){
            return obj.destroyed === true;
        });

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
