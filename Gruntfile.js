module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
         vendorCss:{
            //todo update this when vendors are selected for more specific file list
            src: [ 'www/libs/components/**/*.css'],
            dest: 'www/css/vendors.css'
         },
         vendorJs:{
            src: [
               //'www/lib/components/angular/angular.min.js',
               'www/lib/js/ionic.bundle.js',
               //'www/lib/js/ionic-angular.min.js',
               //'www/lib/components/angular-ui-router/release/angular-ui-router.min.js',
               'www/lib/components/angular-keepit/dist/KeepIt.min.js',
               'www/lib/components/angular-keepit/dist/KeepItLocalStorageService.min.js',
               'www/lib/components/momentjs/min/moment.min.js'],
            dest: 'www/js/vendors.js'
         }
      },
      ngmin :{
         dist:{
            src: [
               'www/js/app/modules.js',
               'www/js/app/run.js',
               'www/js/app/config/**/*.js',
               'www/js/app/common/**/*.js',
               'www/js/app/sports/**/*.js',
               'www/js/app/api/**/*.js',
               'www/js/app/controllers/**.js'
            ],
            dest: 'www/js/app.ngmin.js'
         }
      },
      uglify: {
         options: {
            mangle: false
         },
         my_target: {
            files: {
               'www/js/app.min.js': ['www/js/app.ngmin.js']
            }
         }
      },
      less: {
         development: {
            files: {
               "www/css/app.css": "www/less/styles.less"
            }
         },
         production: {
            options: {
               yuicompress: true
            },
            files: {
               "www/css/app.min.css": "www/less/styles.less"
            }
         }
      },
      watch: {
         dev : {
            files: ["www/js/app/**","www/less/**"],
            tasks: ['default'],
            options: {
               spawn: false
            }
         }
      }

   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks("grunt-ngmin");
   grunt.loadNpmTasks('grunt-contrib-concat');

   grunt.registerTask('default', [ 'ngmin','concat','less:development','uglify','watch:dev']);
   grunt.registerTask('prod', ['ngmin','concat','less:production','uglify']);
};