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
            init(util.getById('bg'));
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
                    util.circle(ctx,
                        star.position.x, star.position.y,
                        star.size, star.fillStyle
                    );
                }
                for (i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    util.rect(ctx,
                        line.position.x, line.position.y,
                        line.size.width, line.size.height,
                        line.fillStyle
                    );
                }
            }
        };
        vent.emit('bg-item-added', out);
    };


    update = function(){
        var newY,
            line,
            star;

        for (var i = 0; i < stars.length; i++) {
            star = stars[i];
            star.physics.velocity = util.approach(
                star.physics.velocityGoal,
                star.physics.velocity,
                star.physics.friction
            );
            newY = star.position.y + star.physics.velocity;
            if ( newY > star.canvas.height + star.size ) {
                star.restart();
            } else {
                star.position.y = newY;
            }
        }

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            line.physics.velocity = util.approach(
                line.physics.velocityGoal,
                line.physics.velocity,
                line.physics.friction
            );
            newY = line.position.y + line.physics.velocity;
            if ( newY > line.canvas.height + line.size.height ) {
                line.restart();
            } else {
                line.position.y = newY;
            }
        }
    };


    bindEvents();

});
