module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          '/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/js/main.js': ['_/components/js/*.js']
        } //files
      } //my_target
    }, //uglify
    compass: {
      dev: {
        options: {
          config: 'config.rb'
        } //options
      } //dev
    }, //compass
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['_/components/js/*.js','/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/js/plugins/*.js'],
        tasks: ['uglify']
      }, //script
      sass: {
        files: ['_/components/sass/*.scss','_/components/sass/custom_partials/*.scss','_/components/sass/pages/*.scss'],
        tasks: ['compass:dev']
      }, //sass
      html: {
        files: ['/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/*']
      },
      php: {
        files: ['/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/*']
      }
    } //watch
  }) //initConfig
  grunt.registerTask('default', 'watch');
} //exports