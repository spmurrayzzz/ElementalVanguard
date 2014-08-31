define('util', function(){

    'use strict';


    /**
     * Approach function for velocities, returns a number that approaches
     * targetX based on currentX and a given deltaT.
     * @param  {Number} targetX
     * @param  {Number} currentX
     * @param  {Number} deltaT
     * @return {Number}
     */
    function approach( targetX, currentX, deltaT ) {
        var diff = targetX - currentX;

        if ( diff > deltaT ) {
            return currentX + deltaT;
        } else if ( diff < -deltaT ) {
            return currentX - deltaT;
        } else {
            return targetX;
        }
    }


    /**
     * Return a random number in a range from min to max.
     * @param  {Number} min
     * @param  {Number} max
     * @return {Number}
     */
    function random( min, max ) {
        return Math.random() * (max - min) + min;
    }


    /**
     * Generate a globally unique identifier (for Sprites).
     * @return {String}
     */
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    /**
     * Generate a random CSS color string.
     * @return {String}
     */
    function randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }


    /**
     * Draw a circle to a given context `ctx`.
     * @param  {Object} ctx       canvas 2d context
     * @param  {Number} x         x coordinate
     * @param  {Number} y         y coordinate
     * @param  {Number} radius    raidus of circle
     * @param  {String} fillStyle CSS color value
     * @param  {Object} opts      additional options for context
     * @return {void}
     */
    function circle( ctx, x, y, radius, fillStyle, opts ) {
        var key;

        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }
        ctx.fill();
        if ( opts !== undefined && opts.lineWidth !== undefined ) {
            ctx.stroke();
        }
    }


    /**
     * Draw a rectangle to a given context `ctx`.
     * @param  {Object} ctx       canvas 2d context
     * @param  {Number} x         x coordinate
     * @param  {Number} y         y coordinate
     * @param  {Number} width
     * @param  {Number} height
     * @param  {String} fillStyle CSS color value
     * @param  {Object} opts      additional options for context
     * @return {void}
     */
    function rect( ctx, x, y, width, height, fillStyle, opts ) {
        var key;

        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.rect(x, y, width, height);
        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }
        ctx.fill();
    }


    /**
     * Draws a line from x1,y1 to x2,y2 in a given context `ctx`.
     * @param  {Object} ctx         canvas 2d context
     * @param  {Number} x1
     * @param  {Number} y1
     * @param  {Number} x2
     * @param  {Number} y2
     * @param  {String} strokeStyle CSS color value
     * @param  {Object} opts        additional options for context
     * @return {void}
     */
    function line( ctx, x1, y1, x2, y2, strokeStyle, opts ) {
        var key;

        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }
        ctx.stroke();
    }


    /**
     * Draws a variable sided polygon to a given context `ctx`.
     * @param  {Object} ctx           canvas 2d context
     * @param  {Number} x             x origin
     * @param  {Number} y             y origin
     * @param  {Number} radius        radius of shape
     * @param  {Number} sides         number of sides
     * @param  {String} fillStyle     CSS color value
     * @param  {Object} opts          additional options for context
     * @param  {Number} startAngle    initial starting angle
     * @param  {Boolean} anticlockwise
     * @return {void}
     */
    function polygon( ctx, x, y, radius, sides, fillStyle, opts, startAngle, anticlockwise ) {
        var key,
            a;

        if (sides < 3) {
            return;
        }

        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }

        a = (Math.PI * 2)/sides;
        a = anticlockwise?-a:a;
        ctx.beginPath();
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(startAngle);
        ctx.moveTo(radius,0);
        for (var i = 1; i < sides; i++) {
            ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
        }
        ctx.closePath();
        ctx.restore();
        ctx.strokeStyle = fillStyle;
        ctx.stroke();
        ctx.fillStyle = fillStyle;

        ctx.fill();
    }


    /**
     * Capitalize the first letter of a given string
     * @param  {String} str
     * @return {String}
     */
    function capitalize ( str ){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    return {
        getById: document.getElementById.bind(document),
        QS: document.querySelector.bind(document),
        QSA: document.querySelectorAll.bind(document),
        approach: approach,
        guid: guid,
        randomColor: randomColor,
        random: random,
        circle: circle,
        rect: rect,
        line: line,
        polygon: polygon,
        capitalize: capitalize
    };

});
