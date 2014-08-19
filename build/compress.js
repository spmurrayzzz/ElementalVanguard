module.exports = function( grunt ){

    grunt.registerTask('compress', function(){
        var done = this.async(),
            fs = require('fs'),
            ready = 0;

        function writeCompressed( indexContent ){
            fs.writeFile('./index-compressed.html', indexContent, function( err ) {
                if ( err ) {
                    throw err;
                }
                grunt.log.write('Compressed index built.' + '\n').ok();
                done(true);
            });
        }

        fs.readFile('./build/templates/index.tmpl.html', function( err, data ) {
            var indexContent = new String(data),
                currTime = new Date().getTime(),
                msg;

            if ( err ) {
                throw err;
            }

            fs.readFile('./assets/css/main.css', function( err, data ){
                if ( err ) {
                    throw err;
                }

                indexContent = indexContent.replace(
                    /{{ css }}/g, data.toString()
                );

                ready++;
                if ( ready == 2 ) {
                    writeCompressed(indexContent);
                }
            });

            fs.readFile('./assets/js/js13k.min.js', function( err, data ){
                if ( err ) {
                    throw err;
                }

                indexContent = indexContent.replace(
                    /{{ javascript }}/g, data.toString()
                );

                ready++;
                if ( ready == 2 ) {
                    writeCompressed(indexContent);
                }
            })


        });

    });
};
