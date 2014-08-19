module.exports = {
    options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
            'define': false,
            'Shout': false,
            'console': false,
            'ENV': false,
            'Mustache': false,
            '_': false
        }
    },
    gruntfile: {
        src: 'Gruntfile.js'
    },
    app: {
        src: 'src/**/*.js'
    }
};
