module.exports = {
    options: {
        banner: '<%= banner %>',
        sourceMap: true,
        wrap: 'foo'
        // sourceMapIn: 'assets/js/js13k.js.map',
    },
    dist: {
        src: 'assets/js/js13k.js',
        dest: 'assets/js/js13k.min.js'
    }
}
