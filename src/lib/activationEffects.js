define('activationEffects',

['vent', 'util'],

function( vent, util ){

    var init,
        canvas,
        ctx,
        render,
        update,
        activate,
        activateObj = {
            opacity: 0,
            fillStyle: 'rgba(184,240,240,%a)',
            decrement: 0.01,
            inProgress: false
        },
        updateActivate,
        renderActivate,
        bindEvents
        ;

    init = function(){
        var cvs = util.getById('effects');
        ctx = cvs.getContext('2d');
        canvas = {
            width: cvs.width,
            height: cvs.height,
            ctx: ctx
        };
        vent.emit('effects-canvas-added', canvas);
    };


    bindEvents = function(){
        vent.on('start', function( game ){
            init(game);
            vent.on('render', render);
            vent.on('update', update);
            vent.on('activate', activate);
        });
    };


    update = function(){
        updateActivate();
    };


    render = function(){
        renderActivate();
    };


    activate = function(){
        activateObj.opacity = 1;
        activateObj.inProgress = true;
    };


    updateActivate = function(){
        if ( !activateObj.inProgress ) {
            return;
        }
        activateObj.opacity -= activateObj.decrement;
    };


    renderActivate = function(){
        if ( !activateObj.inProgress ) {
            return;
        }
        ctx.fillStyle = activateObj.fillStyle.replace('%a', activateObj.opacity);
        ctx.fillRect(0, 0, 800, 600);
    };


    bindEvents();

});
