module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    aws: grunt.file.readJSON('aws-keys.json'), // Read the file

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
      },
      dist: {
        options: {
          bucket: 'wadjet-industries',
        },
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['index_bundle.js'],
            dest: '/',
          },
        ],
      },
    },
  });

  // Load the plugin to upload to aws s3
  grunt.loadNpmTasks('grunt-aws-s3');

  // Deploy.
  grunt.registerTask('deploy', 'aws_s3:dist');
};
