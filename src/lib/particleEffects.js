define('particleEffects',

['vent', 'util', 'Particle', 'spritePool'],

function( vent, util, Particle, pool ){

    var explosion,
        init,
        canvas,
        ctx,
        render,
        update,
        particles = [],
        bindEvents
        ;

    init = function(){
        var cvs = util.getById('effects');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };
        vent.emit('effects-canvas-added', canvas);
    };

    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('effects-render', render);
            vent.on('update', update);
        });
        vent.on('kaboom!', explosion);
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


    bindEvents();

});
