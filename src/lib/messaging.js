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
        message,
        subheader;


    /**
     * Initialize messaging module
     * @return {void}
     */
    init = function(){
        elem = util.getById('messenging');
        header = elem.querySelector('h1');
        subheader = elem.querySelector('h4');
    };


    /**
     * Bind event handlers to global event emitter
     * @return {void}
     */
    bindEvents = function(){
        vent.on('start', init);
        vent.on('start-game', hide);
        vent.on('message', message);
    };


    /**
     * Show the messaging element
     * @return {self}
     */
    show = function(){
        elem.classList.add('visible');
        return elem;
    };


    /**
     * Hide the messaging element
     * @return {self}
     */
    hide = function(){
        elem.classList.remove('visible');
        return elem;
    };


    /**
     * Change the main header text
     * @param {String} msg
     * @return {void}
     */
    headerText = function( msg ){
        header.innerHTML = msg;
    };


    /**
     * Change the subheader text
     * @param {String} msg
     * @return {void}
     */
    subheaderText = function( msg ){
        subheader.innerHTML = msg;
    };


    /**
     * Parent event handler for displaying messaging element
     * @param  {String} msg     header text
     * @param  {String} submsg  subheader text
     * @param  {Number} timeout milliseconds in which to hide element
     * @return {void}         
     */
    message = function( msg, submsg, timeout ){
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
    };


    bindEvents();


    return {
        show: show,
        hide: hide,
        header: headerText,
        subheader: subheaderText
    };

});
