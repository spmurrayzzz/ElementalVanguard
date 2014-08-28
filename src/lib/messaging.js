define('messaging',

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
    };


    bindEvents = function(){
        vent.on('start', init);
        vent.on('start-game', hide);
        vent.on('message', function( msg, submsg, timeout ){
            if ( typeof submsg === 'number' ) {
                timeout = submsg;
                submsg = '';
            }
            headerText(msg);
            subheaderText(submsg);
            show();
            if ( timeout ) {
                setTimeout(hide, timeout);
            }
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
