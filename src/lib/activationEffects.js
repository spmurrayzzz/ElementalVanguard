define('activationEffects',

['vent', 'util'],

function( vent, util ){

    'use strict';

    var init,
        canvas,
        ctx,
        render,
        update,
        activate,
        activateObj = {
            opacity: 0,
            fillStyle: 'rgba(184,240,240,%a)',
            decrement: 0.02,
            inProgress: false
        },
        bindEvents
        ;


    /**
     * Initialize the module
     * @return {void}
     */
    init = function(){
        var cvs = util.getById('effects');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };
    };


    /**
     * Bind event handlers to the global emitter
     * @return {void}
     */
    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('effects-render', render);
            vent.on('update', update);
            vent.on('activate', activate);
        });
    };


    /**
     * `activate` elemental effect event handler
     * @return {[type]} [description]
     */
    activate = function(){
        activateObj.opacity = 1;
        activateObj.inProgress = true;
    };


    /**
     * `update` event handler
     * @return {void}
     */
    update = function(){
        if ( !activateObj.inProgress ) {
            return;
        }
        activateObj.opacity -= activateObj.decrement;
        if ( activateObj.opacity < 0 ) {
            activateObj.inProgress = false;
            activateObj.opacity = 0;
        }
    };


    /**
     * `render` event handler
     * @return {void}
     */
    render = function(){
        if ( !activateObj.inProgress ) {
            return;
        }
        ctx.fillStyle = activateObj.fillStyle.replace('%a', activateObj.opacity);
        ctx.fillRect(0, 0, 800, 600);
    };


    bindEvents();

});
