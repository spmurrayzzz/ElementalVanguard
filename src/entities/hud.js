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
        enemyElem,
        enemyCount,
        firstTimeElemental,
        cfg;


    /**
     * Object to store configuration details
     * @type {Object}
     */
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
            height: 200,
            currentHeight: 200,
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


    /**
     * Object that stores render functions for the HUD
     * @type {Object}
     */
    drawItems = {
        score: function(  ) {
            scoreElem.innerHTML = 'Score: ' + score;
        },
        cooldownTimer: function( ctx ){
            var c = cfg.cooldownTimer;
            util.line(ctx, ctx.canvas.width - 15, ctx.canvas.height -50,
                ctx.canvas.width - 15, (ctx.canvas.height -50) - c.height,
                '#333', c.opts.bg
            );
            util.line(ctx, ctx.canvas.width - 15, ctx.canvas.height -50,
                ctx.canvas.width - 15, (ctx.canvas.height -50) - c.height * c.percent,
                c.fillStyle.current, c.opts.fg
            );
        },
        enemyCount: function(){
            enemyElem.innerHTML = 'Enemies let by: ' + enemyCount + '/10';
        }

    };


    /**
     * Initialize the HUD module
     * @return {void}
     */
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

        enemyElem = util.getById('enemies-passed');
        enemyCount = 0;

        cooldownTimer = {
            current: 20,
            lastChecked: Date.now(),
            max: 20,
            timerStarted: null,
            elem: util.getById('cooldown-timer')
        };
        pauseCheck = true;

        firstTimeElemental = true;

        vent.on('update', update);
        vent.on('render', render);
        vent.on('deactivate', resetCooldown);
        vent.on('activate', activateCooldown);
        vent.on('elemental-progress', function( percent ){
            cfg.cooldownTimer.percent = percent;
        });
        vent.on('start-game', function(){
            pauseCheck = false;
            cooldownTimer.timerStarted = Date.now();
            util.getById('title-screen').style.display = 'none';
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
            vent.emit('elemental-ready');
            if ( firstTimeElemental ) {
                vent.emit(
                    'message',
                    '<p class="ready">Elemental Weapons Ready!</p>',
                    2000
                );
                firstTimeElemental = false;
            }
        });
        vent.on('enemy-passed', function(){
            enemyCount++;
        });

    };


    /**
     * Bind all global events relevant to the HUD module
     * @return {void}
     */
    bindEvents = function(){
        vent.on('start', function( obj ){
            init(obj);
        });
        vent.on('enemy-down', function(){
            score += 2;
        });
    };


    /**
     * Activates the effect-specific cooldown timer for a given elemental effect
     * @param {String} element
     * @return {void}
     */
    activateCooldown = function( element ){
        cooldownTimer.current = 10e3;
        cooldownTimer.lastChecked = Date.now();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle[element];
        if ( element === 'earth' ) {
            resetCooldown();
        }
    };


    /**
     * Resets the primary 20 second global cooldown for all elemental effects
     * @return {void}
     */
    resetCooldown = function(){
        if ( activeIcon ) {
            activeIcon.classList.remove('on');
        }
        cooldownTimer.current = 20e3;
        cooldownTimer.display = 20;
        cooldownTimer.lastChecked = Date.now();
        cfg.cooldownTimer.fillStyle.current = cfg.cooldownTimer.fillStyle.default;
        cfg.cooldownTimer.percent = 0;
        cooldownTimer.timerStarted = Date.now();
        pauseCheck = false;
    };


    /**
     * This method gets involved on `update` events to recalculate cooldown
     * values and fire events when needed.
     * @return {void}
     */
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

        var now = Date.now(),
            diff = now - cooldownTimer.timerStarted;

        cooldownTimer.current = diff;
        cooldownTimer.lastChecked = now;
        cfg.cooldownTimer.percent = (now - cooldownTimer.timerStarted) / 20e3;
        cooldownTimer.display = cooldownTimer.max - parseInt(cooldownTimer.current/1000);
    };


    /**
     * Parent method to invoke on `update` events
     * @return {void}
     */
    update = function(){
        checkCooldown();
    };


    /**
     * Parent method to invole on `render` events
     * @return {void} [description]
     */
    render = function(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw('score');
        draw('cooldownTimer');
        draw('enemyCount');
    };


    /**
     * Convenience method to draw a given HUD item
     * @param  {String} name
     * @return {void}
     */
    draw = function( name ){
        drawItems[name](ctx);
    };


    bindEvents();

});
