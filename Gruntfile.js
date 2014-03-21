module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      copy:{
         css:{
            flatten: false,
            expand:true,
            cwd: 'src/lib/css/',
            src: [
               'ionic.min.css'],
            dest: 'www/css/'
         },
         font:{
            flatten: false,
            expand:true,
            cwd: 'src/lib/fonts/',
            src: [
               '**'],
            dest: 'www/fonts/'
         }
      },
      concat:{
         vendorCss:{
            //todo update this when vendors are selected for more specific file list
            src: [ 'www/libs/components/**/*.css'],
            dest: 'www/css/vendors.css'
         },
         vendorJs:{
            src: [
               //'src/lib/components/angular/angular.min.js',
               'src/lib/js/ionic.bundle.js',
               //'src/lib/js/ionic-angular.min.js',
               //'src/lib/components/angular-ui-router/release/angular-ui-router.min.js',
               'src/lib/components/angular-keepit/dist/KeepIt.min.js',
               'src/lib/components/angular-keepit/dist/KeepItLocalStorageService.min.js',
               'src/lib/components/momentjs/min/moment.min.js'],
            dest: 'www/js/vendors.js'
         }
      },
      ngmin :{
         dist:{
            src: [
               'src/js/app/modules.js',
               'src/js/app/run.js',
               'src/js/app/config/**/*.js',
               'src/js/app/common/**/*.js',
               'src/js/app/sports/**/*.js',
               'src/js/app/api/**/*.js',
               'src/js/app/controllers/**.js'
            ],
            dest: '_tmp/js/app.ngmin.js'
         }
      },
      uglify: {
         options: {
            mangle: false
         },
         my_target: {
            files: {
               'www/js/app.min.js': ['_tmp/js/app.ngmin.js']
            }
         }
      },
      less: {
         development: {
            files: {
               "www/css/app.css": "src/less/styles.less"
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
            files: ["src/js/app/**","www/templates/**"],
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
   grunt.loadNpmTasks('grunt-contrib-copy');

   grunt.registerTask('default', [ 'ngmin','concat','copy','less:development','uglify','watch:dev']);
   grunt.registerTask('prod', ['ngmin','concat','copy','less:production','uglify']);
};