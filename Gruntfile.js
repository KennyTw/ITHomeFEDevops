module.exports = function (grunt) { 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),  	
    concat: {
            css: {
                src: [					
                     './apps/client/css/kidart.css'					
                ],
                dest: './apps/client/css/bundle.css'
            }
    },
    cssmin: {
      minify: {
       	src: './apps/client/css/bundle.css',
       	dest: './apps/client/css/bundle.min.css'
       }
    },
    browserify: {
    prod: {
        src: ['./src/js/app.js'] ,	  
        dest: './apps/client/js/bundle.js',
		options: {
				transform: ['jadeify','debowerify']
			}
    }} ,
    jshint: {
      all: ['./apps/client/*.js']
    } ,
    uglify: {
    my_target: {
      files: {
        './apps/client/js/bundle.min.js': ['./apps/client/js/bundle.js']
      }
    }
   } ,
    shell: { 
		tar : {
			 options: {                      
                stdout: true
            },
            command: 'sudo tar -zxvf ~/deploy/source.tgz -C ~/deploy/code'			
		},
        rsync : {                      
            options: {                      
                stdout: true
            },
            command: 'rsync -avh ~/deploy/code/ ~/code/ --exclude "source.tgz"  --progress  --no-times --checksum'
        },
		bower: {                      
            options: {                      
                stdout: true
            },
            command: 'bower install  --allow-root'
        } ,		
		npm : {
			options: {                      
                stdout: true
            },
            command: 'npm install'
		} ,
		chmod : {
			options: {                      
                stdout: true
            },
            command: 'chmod 776 -R ./*'
		},		
		deploy : {
			options: {                      
                stdout: true
            },
            command: './app deploy'		
		},
		start : {
			options: {                      
                stdout: true
            },
            command: './app start'		
		}
    },  
	clean: {
		build: ["./bower_components"]
	},
	mochaTest: {
            test: {
                src: ['test/*.js'],
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
    }   
   
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browserify'); 
  grunt.loadNpmTasks('grunt-contrib-uglify');  
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default',['shell:tar','shell:rsync','shell:npm','shell:deploy']);
  grunt.registerTask('ci',['shell:start','shell:bower','shell:npm','concat','cssmin','browserify:prod','uglify','shell:deploy']);  
  grunt.registerTask('chmod',['shell:chmod']);   
  grunt.registerTask('test', ['mochaTest:test']);
};
