define('engine',

['vent', 'Enemy', 'spritePool', 'Laser'],

function( vent, Enemy, pool, Laser ){

    var init,
        bindEvents,
        createEnemy,
        canvas,
        checkLaserCollisions,
        colliders,
        enemyCache,
        currentEffect,
        lastCreated = new Date().getTime();


    init = function( game ){
        enemyCache = [];
        colliders = [];
        canvas = game.canvas;
    };


    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('update', createEnemy);
            vent.on('update', checkLaserCollisions);
        });
        vent.on('laser-cache-updated', function( laserCache ){
            colliders = laserCache;
        });
        vent.on('activate', function( effect ) {
            currentEffect = effect;
        });
        vent.on('deactivate', function(){
            currentEffect = null;
        });
    };

    createEnemy = function(){
        var enemy;

        if ( lastCreated > new Date().getTime() - 3000 ) {
            return;
        }

        enemy = pool.recycle('enemies');

        if ( !enemy ) {
            enemy = new Enemy(canvas);
            pool.register('enemies', enemy);
            enemyCache.push(enemy);
        }

        enemy.create(currentEffect || null);

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
                    if ( collider instanceof Laser) {
                        vent.emit('enemy-down');
                    }
                    enemy.destroy();
                    collider.destroy();
                }
            });
        });
    };


    bindEvents();

});
