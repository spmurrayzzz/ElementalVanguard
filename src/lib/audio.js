define('audio', ['jsfxr', 'vent'], function( jsfxr, vent ){

    'use strict';

    var ctx = new window.AudioContext();

    function register( namespace, sound ){
        var arrayBuffer = jsfxr(sound);

        ctx.decodeAudioData(arrayBuffer, function( buffer ){
            vent.on(namespace, function(){
                var src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect(ctx.destination);
                src.start(0);
            });
        });
    }

    register('shoot', [0,,0.0243,,0.2334,0.7546,,-0.3971,,,,,,,,,,,1,,,,,0.33]);
    register('kaboom!', [3,,0.233,0.3771,0.67,0.0656,,-0.29,,,,,,,,0.75,-0.24,0.34,0.15,-0.18,0.76,,,0.31]);

});
