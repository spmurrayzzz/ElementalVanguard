define('particleEffects',

['vent', 'util', 'Particle'],

function( vent, util, Particle ){

    var explosion,
        init,
        canvas,
        ctx,
        render,
        update,
        particles = [],
        bindEvents
        ;

    init = function( game ){
        var cvs = document.createElement('canvas');
        ctx = cvs.getContext('2d');
        cvs.width = game.canvas.width;
        cvs.height = game.canvas.height;
        cvs.id = 'effects-canvas';
        util.getById('game-container').appendChild(cvs);
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
            vent.on('render', render);
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
            }
        }
    };


    render = function(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.render();
        }
    };


    explosion = function( x, y ){
        var particleAmt = Math.random()*20 + 50,
            particle;

        for (var i = 0; i < particleAmt; i++) {
            particle = new Particle(canvas);
            particle.position = { x: x, y: y };
            particles.push(particle.create());
        }

    };


    bindEvents();

});
