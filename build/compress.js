module.exports = function( grunt ){

    grunt.registerTask('compress', function(){
        var done = this.async(),
            fs = require('fs'),
            exec = require('child_process').exec,
            ready = 0;

        function writeCompressed( indexContent ){
            fs.writeFile('./index-compressed.html', indexContent, function( err ) {
                if ( err ) {
                    throw err;
                }

                exec('zip -q9 js13k-2014.zip index-compressed.html |  ls -lrt | grep .zip | awk \'{print $5}\'', function( err, stdout ){
                    grunt.log.write('Compressed file size: ' + stdout + '\n').ok();
                    done(true);
                });
            });
        }

        fs.readFile('./build/templates/index.tmpl.html', function( err, data ) {
            var indexContent = new String(data),
                currTime = Date.now(),
                msg;

            if ( err ) {
                throw err;
            }

            fs.readFile('./assets/css/main.min.css', function( err, data ){
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
