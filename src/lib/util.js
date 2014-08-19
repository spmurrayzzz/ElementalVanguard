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


    function guid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    function randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }


    return {
        getById: document.getElementById.bind(document),
        approach: approach,
        guid: guid,
        randomColor: randomColor
    };
});
