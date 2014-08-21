define('util', function(){

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


    function random( min, max ) {
        return Math.random() * (max - min) + min;
    }


    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    function randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }


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


    function line( ctx, x1, y1, x2, y2, opts ) {
        var key;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }
        ctx.stroke();
    }


    function lineRotate( ctx, x1, y1, x2, y2, rotate, opts ) {
        var key;

        ctx.save();
        ctx.beginPath();
        ctx.translate(x1, y1);
        ctx.rotate(-rotate);
        ctx.moveTo(0, 0);
        ctx.lineTo( x2 - x1, y2 - y1 );
        if ( opts !== undefined ) {
            for ( key in opts ) {
                ctx[key] = opts[key];
            }
        }
        ctx.stroke();
        ctx.restore();
    }


    return {
        getById: document.getElementById.bind(document),
        approach: approach,
        guid: guid,
        randomColor: randomColor,
        random: random,
        circle: circle,
        rect: rect,
        line: line,
        lineRotate: lineRotate
    };

});
