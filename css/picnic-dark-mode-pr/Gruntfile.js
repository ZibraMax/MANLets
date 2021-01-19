var fs = require("fs");

module.exports = function(grunt) {
  grunt.initConfig({
    jade: {
      compile: {
        files: [
          {
            cwd: "docs",
            src: "**/*.html.jade",
            dest: "docs/",
            expand: true,
            ext: ".html"
          }
        ]
      }
    },

    concat: {
      options: { separator: "\n\n" },
      basic_and_extras: {
        files: {
          "temp/test.html": ["src/test.html", "src/plugins/**/test.html"],
          "temp/readme.md": ["src/readme.md", "src/plugins/**/readme.md"]
        }
      }
    },

    copy: {
      main: {
        files: [
          { src: "picnic.min.css", dest: "releases/picnic.min.css" },
          { src: "picnic.min.css", dest: "releases/plugins.min.css" }
        ]
      }
    },

    usebanner: {
      taskName: {
        options: {
          position: "top",
          banner:
            "/* Picnic CSS v" +
            grunt.file.readJSON("package.json").version +
            " http://picnicss.com/ */",
          linebreak: true
        },
        files: { src: "picnic.min.css" }
      }
    },

    watch: {
      scripts: {
        files: ["package.js", "Gruntfile.js", "src/**/*.*", "docs/**/*.*"],
        tasks: ["default"],
        options: { spawn: false }
      }
    },

    bytesize: {
      all: {
        src: ["picnic.min.css"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-banner");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-bytesize");
  grunt.registerTask("default", [
    "concat",
    "usebanner",
    "copy",
    "jade",
    "bytesize"
  ]);
};
