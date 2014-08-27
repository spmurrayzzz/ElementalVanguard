define('titleScreen', ['util', 'vent'], function( util, vent ){

    var init,
        bindEvents,
        screens,
        elem,
        next,
        currentIndex,
        cacheElements;


    init = function(){
        cacheElements();
        currentIndex = 0;
        screens[0].classList.add('on');
        bindEvents();
    };


    cacheElements = function(){
        var nl = util.QSA('.title');
        elem = util.getById('title-screen');
        screens = [];
        for (var i = 0; i < nl.length; i++) {
            screens.push(nl[i]);
        }
    };


    bindEvents = function(){
        vent.on('keydown', function( ev ){
            if ( ev.keyCode === 13 ){
                next();
            }
        });
    };


    next = function(){
        currentIndex++;

        if ( !screens[currentIndex] ) {
            screens[currentIndex-1].classList.remove('on');
            elem.style.display = 'none';
            vent.emit('start-game');
            return;
        }

        screens[currentIndex-1].classList.remove('on');
        screens[currentIndex].classList.add('on');
    };


    init();

});
