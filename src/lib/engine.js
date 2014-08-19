define('engine',

['vent', 'Enemy', 'spritePool'],

function( vent, Enemy, pool ){

    var init,
        bindEvents,
        createEnemy,
        canvas,
        enemyCache,
        lastCreated = new Date().getTime();


    init = function( game ){
        enemyCache = [];
        canvas = game.canvas;
    };


    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('update', createEnemy);
        });
    };

    createEnemy = function(){
        var enemy;

        if ( lastCreated > new Date().getTime() - 5000 ) {
            return;
        }

        enemy = pool.recycle('enemies');

        if ( !enemy ) {
            enemy = new Enemy(canvas);
            pool.register('enemies', enemy);
            enemyCache.push(enemy);
            enemy.create();
        }

        lastCreated = new Date().getTime();
    };


    bindEvents();

});
