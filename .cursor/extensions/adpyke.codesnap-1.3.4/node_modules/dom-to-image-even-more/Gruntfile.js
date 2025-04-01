'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: false,
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma']);
  grunt.registerTask('default', ['test']);
};
