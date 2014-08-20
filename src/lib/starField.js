define('starField',

['Star', 'SpeedLine', 'vent', 'util', ],

function( Star, SpeedLine, vent, util ){

    'use strict';

    var init,
        create,
        bindEvents,
        stars = [],
        lines = [],
        canvas,
        update,
        ctx,
        cfg;


    cfg = {
        starCount: 500,
        lineCount: 8
    };


    init = function( obj ){
        canvas = obj;
        ctx = canvas.getContext('2d');
    };


    bindEvents = function(){
        vent.on('start', function( ){
            init(util.getById('bg-canvas'));
            create();
        });
        vent.on('update', update);
    };


    create = function(){
        for (var i = 0; i < cfg.starCount; i++) {
            stars.push(new Star(canvas).create());
        }
        for (i = 0; i < cfg.lineCount; i++) {
            lines.push(new SpeedLine(canvas).create());
        }
        var out = {
            render: function(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < stars.length; i++) {
                    var star = stars[i];
                    ctx.beginPath();
                    ctx.arc(
                        star.position.x, star.position.y,
                        star.size, 0, 2 * Math.PI, false
                    );
                    ctx.fillStyle = star.fillStyle;
                    ctx.fill();
                }
                for (i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    ctx.beginPath();
                    ctx.rect(
                        line.position.x, line.position.y,
                        line.size.width, line.size.height
                    );
                    ctx.fillStyle = line.fillStyle;
                    ctx.fill();
                }
            }
        };
        vent.emit('bg-item-added', out);
    };


    update = function(){
        var newY;

        for (var i = 0; i < stars.length; i++) {
            stars[i].physics.velocity = util.approach(
                stars[i].physics.velocityGoal,
                stars[i].physics.velocity,
                stars[i].physics.friction
            );
            newY = stars[i].position.y + stars[i].physics.velocity;
            if ( newY > stars[i].canvas.height + stars[i].size ) {
                stars[i].restart();
            } else {
                stars[i].position.y = newY;
            }
        }

        for (i = 0; i < lines.length; i++) {
            lines[i].physics.velocity = util.approach(
                lines[i].physics.velocityGoal,
                lines[i].physics.velocity,
                lines[i].physics.friction
            );
            newY = lines[i].position.y + lines[i].physics.velocity;
            if ( newY > lines[i].canvas.height + lines[i].size.height ) {
                lines[i].restart();
            } else {
                lines[i].position.y = newY;
            }
        }
    };


    bindEvents();

});
