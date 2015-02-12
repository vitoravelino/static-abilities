module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
      pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/** <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                  '<%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
                  '* Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author %>;\n' +
                  '* Licensed <%= pkg.license %> \n*/\n\n',

        // concat
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: [
                    'src/static-abilities.js'
                ],
                dest: 'dist/static-abilities.js'
            }
        },

        // coveralls
        coveralls: {
            src: 'bin/coverage/lcov.info'
        },

        // jasmine + instabul
        jasmine: {
            src: ['src/*.js'],
            options: {
                specs: ['test/*.spec.js'],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'bin/coverage/coverage.json',
                    report: {
                        type: 'lcov',
                        options: {
                            dir: 'bin/coverage'
                        }
                    },
                    thresholds: {
                        lines: 75,
                        statements: 75,
                        branches: 75,
                        functions: 90
                    }
                }
            }
        },

        // jshint
        jshint: {
            files: ['src/static-abilities.js']
        },

        // uglify
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                  'dist/static-abilities.min.js': ['src/static-abilities.js']
                }
            }
        },

        // watch
        watch: {
            files: ['src/**/*.js', 'test/**/*.js'],
            tasks: ['jshint']
        }
    });

    grunt.registerTask('dist', ['jshint', 'jasmine', 'concat', 'uglify']);
    grunt.registerTask('ci', ['jshint', 'jasmine', 'coveralls']);
};
