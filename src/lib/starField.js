define('starField',

['Star', 'SpeedLine', 'vent' ],

function( Star, SpeedLine, vent ){

    'use strict';

    var init,
        create,
        bindEvents,
        stars = [],
        canvas,
        cfg;


    cfg = {
        starCount: 150,
        lineCount: 8
    };


    init = function( game ){
        canvas = game.canvas;
    };


    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            create();
        });
    };


    create = function(){
        for (var i = 0; i < cfg.starCount; i++) {
            stars.push(new Star(canvas).create());
        }
        for (i = 0; i < cfg.lineCount; i++) {
            stars.push(new SpeedLine(canvas).create());
        }
    };


    bindEvents();

});
