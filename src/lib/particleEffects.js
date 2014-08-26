define('particleEffects',

['vent', 'util', 'Particle', 'spritePool'],

function( vent, util, Particle, pool ){

    'use strict';

    var explosion,
        init,
        canvas,
        ctx,
        render,
        update,
        particles = [],
        emitFire,
        bindEvents,
        fireCfg
        ;

    init = function(){
        var cvs = util.getById('effects');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };
        fireCfg = [
            {
                fill: '#f37d00',
                life: 20
            },
            {
                fill: '#f36026',
                life: 15
            },
            {
                fill: '#f2944e',
                life: 10
            },
            {
                fill: '#f1f1f1',
                life: 10
            }
        ];
    };

    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('effects-render', render);
            vent.on('update', update);
            vent.on('kaboom!', explosion);
            vent.on('emit-fire', emitFire);
        });
    };


    update = function(){
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.update();
            if ( particle.life <= 0 ) {
                particles.splice(i, 1);
                particle.destroyed = true;
            }
        }
    };


    render = function(){
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.render();
        }
    };


    explosion = function( x, y ){
        var particleAmt = Math.random()*20 + 50,
            particle;

        for (var i = 0; i < particleAmt; i++) {
            particle = pool.recycle('particles');
            if ( !particle ) {
                particle = new Particle(canvas);
                pool.register('particles', particle);
            } else {
                Particle.call(particle, canvas);
            }
            particle.position.x = x;
            particle.position.y = y;
            particles.push(particle.create());
        }

    };


    emitFire = function( x, y ){
        var particle,
            fire;
        for (var i = 0; i < 20; i++) {
            fire = fireCfg[Math.round(util.random(0, 3))];
            particle = pool.recycle('particles');
            if ( !particle ) {
                particle = new Particle(canvas);
                pool.register('particles', particle);
            } else {
                Particle.call(particle, canvas);
            }
            particle.life = fire.life;
            particle.size = util.random(1, 3);
            particle.fillStyle = fire.fill;
            // particle.fillStyle = 'rgba('+ parseInt(util.random(100, 244)) + ',0,8,' +
            //     Math.random() * ((1 - 0.5) + 0.5) + ')';
            particle.position.x = x;
            particle.position.y = y;
            particles.push(particle.create());
        }
    };


    bindEvents();

});
