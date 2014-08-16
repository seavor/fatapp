module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.initConfig({

		uglify: {
			my_target: {
				files: {
					'webapp/css/style.css' : ['components/css/style.css']
				}
			}
		},

		compass: {
			dev: {
				options: {
					config: 'config.rb'
				}
			}
		},

		watch: {
			options: {livereload: true},

			scripts: {
				files: ['webapp/js/main.js'],
				tasks: []
			},
			sass: {
				files: ['components/css/style.scss'],
				tasks: ['compass:dev']
			},
			html: {
				files: ['webapp/index.html', 'webapp/partials/*.html', 'webapp/modals/*.html'],
				tasks: [ ]
			}
		}

	});

	grunt.registerTask('default', 'watch');
}