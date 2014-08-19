define('audio', ['jsfxr', 'vent'], function( jsfxr, vent ){

    'use strict';

    function play( sound ){
        var player = new Audio(),
            soundURL = jsfxr(sound);
        player.src = soundURL;
        player.play();
    }

    vent.on('shoot', function(){
        play([0,,0.0243,,0.2334,0.7546,,-0.3971,,,,,,,,,,,1,,,,,0.33]);
    });


    vent.on('kaboom!', function(){
        play([3,0.03,0.53,0.79,0.54,0.1062,,,,,,,,,,0.7691,-0.2803,-0.1151,1,,,,,0.16]);
    });

});
