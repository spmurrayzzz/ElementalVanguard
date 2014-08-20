define('HUD',

['vent', 'util', 'Sprite'],

function( vent, util ){

    'use strict';

    var init,
        ctx,
        canvas,
        update,
        render,
        bindEvents,
        drawItems,
        score,
        draw;


    drawItems = {
        bar: function( ctx ){
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.rect(0, ctx.canvas.height - 50, ctx.canvas.width, 50);
            ctx.fill();

            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.rect(0, ctx.canvas.height - 52, ctx.canvas.width, 2);
            ctx.fill();
        },
        score: function( ctx ) {
            ctx.font = "20px Courier";
            ctx.fillStyle = '#f1f1f1';
            ctx.textAlign = 'right';
            ctx.fillText(
                'Score: ' + score,
                ctx.canvas.width - 25, ctx.canvas.height - 20
            );
        }
    };


    init = function( obj ){
        var cvs = document.createElement('canvas');
        ctx = cvs.getContext('2d');
        cvs.width = obj.width;
        cvs.height = obj.height;
        cvs.id = 'hud-canvas';
        util.getById('game-container').appendChild(cvs);
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };

        score = 0;

        vent.on('update', update);
        vent.on('render', render);
    };


    bindEvents = function(){
        vent.on('effects-canvas-added', function( obj ){
            init(obj);
        });
        vent.on('enemy-down', function(){
            score += 2;
        });
    };


    update = function(){

    };


    render = function(){
        ctx.clearRect(0, 0, ctx.canvas.width, 50);
        draw('bar');
        draw('score');
    };


    draw = function( name ){
        drawItems[name](ctx);
    };


    bindEvents();

});
