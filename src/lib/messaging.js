define('messenging', ['util', 'vent'], function( util, vent ){

    'use strict';

    var init,
        bindEvents,
        show,
        hide,
        elem;


    init = function(){
        elem = util.getById('messenging');
        elem.innerHTML = 'Elemental Vanguard';
        setTimeout(function(){
            show();
        }, 2000);
    };


    bindEvents = function(){
        vent.on('start', function(){
            init();
        });
    };


    show = function(){
        elem.classList.add('visible');
        return elem;
    };


    hide = function(){
        elem.classList.remove('visible');
        return elem;
    };


    bindEvents();

});
