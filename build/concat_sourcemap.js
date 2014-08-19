module.exports = {
    options: {
        sourcesContent: true
    },
    target: {
        files: {
            'assets/js/js13k.js': [
                'src/lib/module.js',
                'src/**/*.js'
            ]
        }
    }
};
