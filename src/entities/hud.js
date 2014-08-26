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
        scoreElem,
        draw,
        cooldownTimer,
        activateCooldown,
        resetCooldown,
        checkCooldown,
        pauseCheck,
        activeIcon,
        icons,
        cfg;


    cfg = {
        cooldownTimer: {
            fillStyle: {
                current: '#f1f1f1',
                default: '#f1f1f1',
                water: 'rgba(0, 0, 220, 1)',
                air: '#b8f0f0',
                fire: 'rgba(255, 0, 0, 1)'
            },
            font: '20px Courier',
            textAlign: 'right',
            height: 400,
            currentHeight: 400,
            opts: {
                fg: {
                    lineWidth: 10,
                    lineCap: 'round'
                },
                bg: {
                    lineWidth: 12,
                    lineCap: 'round'
                }
            },
            percent: 0
        }
    };


    drawItems = {
        score: function(  ) {
            scoreElem.innerHTML = 'Score: ' + score;
        },
        cooldownTimer: function( ctx ){
            var c = cfg.cooldownTimer;
            util.line(ctx, ctx.canvas.width - 25, ctx.canvas.height - 100,
                ctx.canvas.width - 25, (ctx.canvas.height - 100) - c.height,
                '#333', c.opts.bg
            );
            util.line(ctx, ctx.canvas.width - 25, ctx.canvas.height - 100,
                ctx.canvas.width - 25, (ctx.canvas.height - 100) - c.height * c.percent,
                c.fillStyle.current, c.opts.fg
            );
        }
    };


    init = function(){
        var cvs = util.getById('hud-canvas');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };

        activeIcon = null;
        icons = util.QSA('.ico');

        score = 0;
        scoreElem = util.getById('score');

        cooldownTimer = {
            current: 20,
            lastChecked: new Date().getTime(),
            max: 20,
            timerStarted: null,
            elem: util.getById('cooldown-timer')
        };
        pauseCheck = true;

        vent.on('update', update);
        vent.on('render', render);
        vent.on('deactivate', resetCooldown);
        vent.on('activate', activateCooldown);
        vent.on('elemental-progress', function( percent ){
            cfg.cooldownTimer.percent = percent;
        });
        vent.on('start-game', function(){
            pauseCheck = false;
            cooldownTimer.timerStarted = new Date().getTime();
        });
        vent.on('activate', function( element ){
            for (var i = 0; i < icons.length; i++) {
                icons[i].classList.remove('on');
            }
            activeIcon = util.getById(element);
            activeIcon.classList.add('on');
        });
        vent.on('cooldown-end', function(){
            for (var i = 0; i < icons.length; i++) {
                icons[i].classList.add('on');
            }
        });

    };


    bindEvents = function(){
        vent.on('start', function( obj ){
            init(obj);
        });
        vent.on('enemy-down', function(){
            score += 2;
        });
    };


    activateCooldown = function( element ){
        cooldownTimer.current = 10e3;
        cooldownTimer.lastChecked = new Date().getTime();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle[element];
        if ( element === 'earth' ) {
            resetCooldown();
        }
    };


    resetCooldown = function(){
        if ( activeIcon ) {
            activeIcon.classList.remove('on');
        }
        cooldownTimer.current = 20e3;
        cooldownTimer.display = 20;
        cooldownTimer.lastChecked = new Date().getTime();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle.default;
        cfg.cooldownTimer.percent = 0;
        cooldownTimer.timerStarted = new Date().getTime();
        pauseCheck = false;
    };


    checkCooldown = function(){
        if ( pauseCheck ) {
            return;
        }
        if ( cooldownTimer.display <= 0 ) {
            vent.emit('cooldown-end');
            cfg.cooldownTimer.fillStyle.current = 'rgba(120, 220, 0, 1)';
            cfg.cooldownTimer.percent = 1;
            pauseCheck = true;
            return;
        }

        var now = new Date().getTime(),
            diff = now - cooldownTimer.timerStarted;

        cooldownTimer.current = diff;
        cooldownTimer.lastChecked = now;
        cfg.cooldownTimer.percent = (now - cooldownTimer.timerStarted) / 20e3;
        cooldownTimer.display = cooldownTimer.max - parseInt(cooldownTimer.current/1000);
    };


    update = function(){
        checkCooldown();
    };


    render = function(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw('score');
        draw('cooldownTimer');
    };


    draw = function( name ){
        drawItems[name](ctx);
    };


    bindEvents();

});
