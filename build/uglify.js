module.exports = {
    options: {
        banner: '<%= banner %>',
        sourceMap: 'assets/js/js13k.min.map',
        sourceMappingURL: 'assets/js/js13k.min.map',
        sourceMapPrefix: 1,
        compress: true,
        mangle: true
    },
    dist: {
        src: 'assets/js/js13k.js',
        dest: 'assets/js/js13k.min.js'
    }
}
