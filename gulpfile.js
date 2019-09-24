const 	gulp = require('gulp'),
		sass = require('gulp-sass'),
	    autoprefixer = require('autoprefixer'),
	    concat       = require('gulp-concat'),
	    fileinclude  = require('gulp-file-include'),
	    gulpif       = require('gulp-if'),
	    postcss      = require('gulp-postcss'),
	    uglify       = require('gulp-uglify'),
	    rename       = require('gulp-rename'),
	    sourcemaps   = require('gulp-sourcemaps'),
	    log          = require('fancy-log'),
	    imagemin     = require('gulp-imagemin'),
	    buffer       = require('vinyl-buffer'),
	    source       = require('vinyl-source-stream')
   		headerComment = require('gulp-header-comment'),
		merge 		 = require('merge-stream'),
		browserSync  = require('browser-sync').create();


// Source and Additional variables
var env,
    outputDir,
    productionBuild,
    sassStyle,
    pagesDeep;
env = process.env.NODE_ENV || 'development';

if (env === 'production') {
    outputDir = 'dist/prod/';
    sassStyle = 'compressed'
    productionBuild = true;
} else {
    outputDir = 'dist/dev/';
    sassStyle = 'expanded'
    productionBuild = false;
};

sass.compiler = require('node-sass');

// Source Locations
var paths = {
    ui: {
        src: 'src/img/*',
        dest: outputDir + 'img/'
    },
    images: {
        src: 'dist/dev/images/*',
        dest: 'dist/prod/images/'
    },
    pages: {
        src: 'src/html/*.html',
        srcdeep: 'src/html/**/*.html',
        dest: outputDir
    },
    styles: {
        src: ['src/scss/**/*.scss'],
        dest: outputDir + 'css/'
    },
    scripts: {
        src: ['node_modules/jquery/dist/jquery.js', 'src/scripts/*.js'],
        dest: outputDir + 'js/'
    }
};


// Compile SCSS into CSS
function style() {
	return gulp.src(paths.styles.src)
        .pipe(headerComment(`CSS Compiled on: <%= moment().format('YYYY-MM-DD HH:mm:ss Z')%>
            ============================================================================== *`))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: sassStyle}).on('error', sass.logError))
		.pipe(sourcemaps.write())
        .pipe(gulpif(productionBuild, rename({ suffix: '.min' })))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

/* JavaScript */
function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(gulpif(productionBuild, uglify()))
        .pipe(concat('main.js'))
        .pipe(gulpif(productionBuild, rename({ suffix: '.min' })))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Compile HTML Pages 
function pages() {
    return gulp.src(paths.pages.src, { sourcemaps: true })
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                compression: productionBuild
            }
        }))
        .pipe(gulp.dest(paths.pages.dest))
        .pipe(browserSync.stream());
}

// Image Compression
function compression() {

    var imagefiles = gulp.src(paths.images.src)
        .pipe(gulpif(productionBuild, imagemin(imagemin.jpegtran({ progressive: true }))))
        .pipe(gulpif(productionBuild, gulp.dest(paths.images.dest)));

    return merge(imagefiles);
}

function replenish() {
    var imgfiles = gulp.src(paths.ui.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.ui.dest));

    var icons = gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest(outputDir+'webfonts/'));

    return merge(imgfiles,icons);
}


function watch() {
	browserSync.init({
		server: {
			baseDir: './' + outputDir
		}
	});

    gulp.watch(paths.styles.src, style).on('save', browserSync.reload);
    gulp.watch(paths.scripts.src, scripts).on('save', browserSync.reload);
	gulp.watch(paths.pages.src, pages).on('save', browserSync.reload);
    gulp.watch(paths.pages.srcdeep, pages).on('save', browserSync.reload);
	gulp.watch(paths.images.src, compression).on('change', browserSync.reload);
}

var build = gulp.parallel(pages, style, scripts, compression, replenish, watch);

exports.pages = pages;
exports.images = compression;
exports.replenish = replenish;

exports.scripts = scripts;
exports.style = style;
exports.watch = watch;

exports.default = build;


