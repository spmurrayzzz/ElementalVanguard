define('audio', ['jsfxr', 'vent'], function( jsfxr, vent ){

    'use strict';

    var AC =  window.webkitAudioContext || window.AudioContext,
        ctx = new AC();

    function register( namespace, sound ){
        var buffer = jsfxr(sound, ctx);

        vent.on(namespace, function(){
            var src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(ctx.destination);
            src.start(0);
        });
    }

    register('shoot', [0,,0.0243,,0.2334,0.7546,,-0.3971,,,,,,,,,,,1,,,,,0.33]);
    register('kaboom!', [3,,0.233,0.3771,0.67,0.0656,,-0.29,,,,,,,,0.75,-0.24,0.34,0.15,-0.18,0.76,,,0.31]);
    register('activate', [0,,0.3417,,0.49,0.2556,,0.2183,,0.6583,0.4986,-0.24,,0.37,-0.0799,,,,1,,,,,0.34]);
    register('deactivate', [0,,0.3469,,0.44,0.2142,,-0.18,,0.2873,0.1353,,,0.3639,,,,,1,,,,,0.4]);
    register('elemental-ready', [1,,0.3367,,0.29,0.3476,,0.2325,,,,,,,,,,,1,,,,,0.39]);

});
