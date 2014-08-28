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
        fireCfg,
        groupName = 'particles'
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
                fill: 'rgba(243,125,0,%a)',
                life: 25
            },
            {
                fill: 'rgba(243,96,38,%a)',
                life: 20
            },
            {
                fill: 'rgba(242,148,78,%a)',
                life: 20
            },
            {
                fill: 'rgb(241,241,241,%a)',
                life: 15
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
            particle.render( ctx );
        }
    };


    explosion = function( x, y ){
        var particleAmt = Math.random()*20 + 50,
            particle;

        for (var i = 0; i < particleAmt; i++) {
            particle = pool.recycle(groupName);
            if ( !particle ) {
                particle = new Particle(canvas);
                pool.register(groupName, particle);
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
        for (var i = 0; i < 10; i++) {
            fire = fireCfg[Math.round(util.random(0, 3))];
            particle = pool.recycle(groupName);
            if ( !particle ) {
                particle = new Particle(canvas, true);
                pool.register(groupName, particle);
            } else {
                Particle.call(particle, canvas, true);
            }
            particle.life = fire.life;
            particle.direction = -(Math.random()*Math.PI);
            particle.size = util.random(1, 3);
            particle.fillStyle = fire.fill.replace(/%a/,util.random(0, 1));
            particle.position.x = x;
            particle.position.y = y + 25;
            particles.push(particle.create());
        }
    };


    bindEvents();

});
