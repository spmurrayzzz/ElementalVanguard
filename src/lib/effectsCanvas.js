define('effectsCanvas', ['vent', 'util'], function( vent, util ){

    'use strict';

    var ctx = util.getById('effects').getContext('2d');

    vent.on('render', function(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        vent.emit('effects-render');
    });

});
