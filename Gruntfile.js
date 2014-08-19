/*global module:false*/
module.exports = function( grunt ) {

    'use strict';

    grunt.initConfig(
        require('./build/gruntConfig')(grunt)
    );

    // npm tasks
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', [
         'jshint:app', 'concat_sourcemap', 'uglify'
    ]);

};
