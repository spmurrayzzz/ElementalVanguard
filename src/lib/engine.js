define('engine',

['vent', 'Enemy', 'spritePool', 'Laser', 'util', 'game'],

function( vent, Enemy, pool, Laser, util ){

    'use strict';

    var init,
        bindEvents,
        createEnemy,
        canvas,
        checkLaserCollisions,
        checkPlayerCollisions,
        colliders,
        enemyCache,
        currentEffect,
        waveCount,
        getSquadron,
        getWave,
        player,
        currentWave,
        lastCreated;


    init = function( game ){
        enemyCache = [];
        colliders = [];
        waveCount = 0;
        canvas = game.canvas;
        lastCreated = new Date().getTime();
        currentWave = getWave();
    };


    bindEvents = function(){
        vent.on('player-added', function( obj ){
            player = obj;
        });
        vent.on('start', function( game ){
            init(game);
            vent.on('update', createEnemy);
            vent.on('update', checkLaserCollisions);
            vent.on('update', checkPlayerCollisions);
            vent.on('laser-cache-updated', function( laserCache ){
                colliders = laserCache;
            });
            vent.on('activate', function( effect ) {
                currentEffect = effect;
            });
            vent.on('deactivate', function(){
                currentEffect = null;
            });
        });
    };

    createEnemy = function(){
        var enemy,
            squadron;

        if ( lastCreated > new Date().getTime() - 3000 ) {
            return;
        }

        squadron = getSquadron(currentWave);

        for (var i = 0; i < squadron; i++) {
            enemy = pool.recycle('enemies');

            if ( !enemy ) {
                enemy = new Enemy(canvas);
                pool.register('enemies', enemy);
                enemyCache.push(enemy);
            }

            enemy.create(currentEffect || null);
        }

        lastCreated = new Date().getTime();
    };


    checkLaserCollisions = function() {
        var dx,
            dy,
            distance;

        enemyCache.forEach(function( enemy ){
            colliders.forEach(function( collider ){
                dx = enemy.position.x - collider.position.x;
                dy = enemy.position.y - collider.position.y;
                distance = Math.sqrt(dx * dx + dy * dy);

                if ( distance < enemy.size + collider.size) {
                    vent.emit('kaboom!', enemy.position.x, enemy.position.y);
                    if ( collider instanceof Laser && !enemy.effected ) {
                        vent.emit('enemy-down');
                    }
                    enemy.destroy();
                    collider.destroy();
                }
            });
        });
    };


    checkPlayerCollisions = function(){
        if ( !player ) {
            return;
        }
        enemyCache.forEach(function( enemy ){
            var distX = Math.abs(
                    enemy.position.x - player.position.x-player.dims.width/2
                ),
                distY = Math.abs(
                    enemy.position.y - player.position.y-player.dims.height/2
                );

            if ( distX > (player.dims.width/2 + enemy.size) ||
                distY > (player.dims.height/2 + enemy.size) ) {
                return false;
            }

             if (distX <= (player.dims.width/2) ||
                 distY <= (player.dims.height/2)) {
                 player.destroy();
                 vent.off('update', checkPlayerCollisions);
             }
        });
    };


    getSquadron = (function(){
        var count = 0;
        return function( wave ){
            return wave[++count];
        };
    })();


    getWave = function(){
        var wave = [],
            count = 30;

        for (var i = 0; i < count; i++) {
            wave.push(util.random(0, 2));
        }

        return wave;
    };


    bindEvents();

});
