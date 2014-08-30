define('titleScreen',

['util', 'vent'],

function( util, vent ){

    var init,
        bindEvents,
        screens,
        elem,
        next,
        keyDownHandler,
        currentIndex,
        cacheElements;


    /**
     * Initialize the titleScreen module
     * @return {void}
     */
    init = function(){
        cacheElements();
        currentIndex = 0;
        screens[0].classList.add('on');
        bindEvents();
    };


    /**
     * Cache the DOM elements needed for the module
     * @return {void}
     */
    cacheElements = function(){
        var nl = util.QSA('.title');
        elem = util.getById('title-screen');
        screens = [];
        for (var i = 0; i < nl.length; i++) {
            screens.push(nl[i]);
        }
    };


    /**
     * Bind event handlers to global event emitter
     * @return {void}
     */
    bindEvents = function(){
        vent.on('keydown', keyDownHandler);
    };


    /**
     * Event handler for user keypress
     * @param {Event} ev
     * @return {void}
     */
    keyDownHandler = function( ev ){
        if ( ev.keyCode === 13 ){
            next();
        }
    };


    /**
     * Show next title screen, after last item ensure that the keydown handler
     * is unbound and start the game.
     * @return {void}
     */
    next = function(){
        currentIndex++;

        if ( !screens[currentIndex] ) {
            screens[currentIndex-1].classList.remove('on');
            elem.style.display = 'none';
            vent.emit('start-game');
            vent.off('keydown', keyDownHandler);
            return;
        }

        screens[currentIndex-1].classList.remove('on');
        screens[currentIndex].classList.add('on');
    };


    init();

});
