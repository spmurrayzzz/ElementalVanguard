define('messenging',

['util', 'vent'],

function( util, vent ){

    'use strict';

    var init,
        bindEvents,
        show,
        hide,
        headerText,
        subheaderText,
        elem,
        header,
        subheader;


    init = function(){
        elem = util.getById('messenging');
        header = elem.querySelector('h1');
        subheader = elem.querySelector('h4');
        setTimeout(function(){
            headerText('Elemental Vanguard');
            subheaderText('Press Enter to Start');
            show();
        }, 2000);
    };


    bindEvents = function(){
        vent.on('start', function(){
            init();
        });
        vent.on('start-game', function(){
            hide();
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


    headerText = function( msg ){
        header.innerHTML = msg;
    };


    subheaderText = function( msg ){
        subheader.innerHTML = msg;
    };


    bindEvents();


    return {
        show: show,
        hide: hide,
        header: headerText,
        subheader: subheaderText
    };

});
