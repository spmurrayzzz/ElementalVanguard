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
        draw,
        cooldownTimer,
        activateCooldown,
        resetCooldown,
        checkCooldown,
        cfg;


    cfg = {
        earthEmblem: {
            fillStyle: [
                '#372720',
                'rgba(73, 52, 42, 0.5)',
                'rgba(104, 74, 59, 0.3)'
            ],
            size: 10,
            x: 30,
            y: 575,
            angle: 0,
            displayProps: {
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }
        },
        waterEmblem: {
            fillStyle: [
                'rgba(0, 0, 220, 1)'
            ],
            size: 10,
            x: 65,
            y: 575,
            angle: 0,
            displayProps: {
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }
        },
        airEmblem: {
            fillStyle: [
                '#b8f0f0'
            ],
            size: 10,
            x: 100,
            y: 575,
            angle: 0,
            displayProps: {
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }
        },
        fireEmblem: {
            fillStyle: [
                'rgba(255, 0, 0, 1)'
            ],
            size: 10,
            x: 135,
            y: 575,
            angle: 0,
            displayProps: {
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }
        },
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
        bar: function( ctx ){
            ctx.beginPath();
            ctx.rect(0, ctx.canvas.height - 50, ctx.canvas.width, 50);
            ctx.fillStyle = '#333';
            ctx.shadowBlur = 0;
            ctx.fill();

            ctx.beginPath();
            ctx.rect(0, ctx.canvas.height - 52, ctx.canvas.width, 2);
            ctx.fillStyle = '#444';
            ctx.shadowBlur = 0;
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
        },
        earthEmblem: function( ctx ){
            var c = cfg.earthEmblem;
            util.polygon(ctx, c.x, c.y, c.size, 7, c.fillStyle[0], c.opts);
        },
        waterEmblem: function( ctx ){
            var c = cfg.waterEmblem;
            util.polygon(ctx, c.x, c.y, c.size, 7, c.fillStyle[0], c.opts);
        },
        airEmblem: function( ctx ){
            var c = cfg.airEmblem;
            util.polygon(ctx, c.x, c.y, c.size, 7, c.fillStyle[0], c.opts);
        },
        fireEmblem: function( ctx ){
            var c = cfg.fireEmblem;
            util.polygon(ctx, c.x, c.y, c.size, 7, c.fillStyle[0], c.opts);
        },
        cooldownTimer: function( ctx ){
            var c = cfg.cooldownTimer;
            util.text(ctx, cooldownTimer.display || 'Ready',
                220, ctx.canvas.height - 20, c.fillStyle.current
            );
            util.line(ctx, ctx.canvas.width - 25, ctx.canvas.height - 125,
                ctx.canvas.width - 25, (ctx.canvas.height - 125) - c.height,
                '#333', c.opts.bg
            );
            util.line(ctx, ctx.canvas.width - 25, ctx.canvas.height - 125,
                ctx.canvas.width - 25, (ctx.canvas.height - 125) - c.height * c.percent,
                c.fillStyle.current, c.opts.fg
            );
        }
    };


    init = function(){
        var cvs = util.getById('hud');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };

        score = 0;
        cooldownTimer = {
            current: 20,
            lastChecked: new Date().getTime(),
            max: 20,
            timerStarted: new Date().getTime()
        };

        vent.on('update', update);
        vent.on('render', render);
        vent.on('deactivate', resetCooldown);
        vent.on('activate', activateCooldown);
        vent.on('elemental-progress', function( percent ){
            cfg.cooldownTimer.percent = percent;
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
        cooldownTimer.current = element === 'earth' ? 20 : 10;
        cooldownTimer.lastChecked = new Date().getTime();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle[element];
    };


    resetCooldown = function(){
        cooldownTimer.current = 20e3;
        cooldownTimer.display = 20;
        cooldownTimer.lastChecked = new Date().getTime();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle.default;
        cfg.cooldownTimer.percent = 0;
        cooldownTimer.timerStarted = new Date().getTime();
    };


    checkCooldown = function(){
        if ( cooldownTimer.display <= 0 ) {
            vent.emit('cooldown-end');
            cfg.cooldownTimer.percent = 1;
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
        draw('bar');
        draw('score');
        draw('earthEmblem');
        draw('waterEmblem');
        draw('airEmblem');
        draw('fireEmblem');
        draw('cooldownTimer');
    };


    draw = function( name ){
        drawItems[name](ctx);
    };


    bindEvents();

});
