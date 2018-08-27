// Module Requirements
var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    log = require('fancy-log'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify');

// System Variable
var jsSources,
    sassSources,
    outputDir,
    sassStyle,
    env;

jsSources = [
    'components/scripts/template.js',
    'components/scripts/main.js'
];



sassSources = ['components/sass/*.scss'];

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = '/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/dev/';
  sassStyle = 'expanded'
} else {
  outputDir = '/Applications/MAMP/htdocs/Dev_MYSITE/templates/TEMPLATE_NAME/';
  sassStyle = 'compressed'
};

gulp.task('scripts', function() {
  return gulp.src(jsSources)
    .pipe(concat('main.js'))
    .pipe(gulpif(env==='production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'));
});


gulp.task('compass', function(done) {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'img',
      style: sassStyle,
      css: outputDir + 'css'
    })
    .on('error', log))
	done();
});

gulp.watch(jsSources, gulp.parallel('scripts'));
gulp.watch('components/sass/*.scss', gulp.parallel('compass'));

gulp.task('default', gulp.series('scripts', 'compass'));