// Module Requirements
const gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('autoprefixer'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    fileinclude = require('gulp-file-include'),
    gulpif = require('gulp-if'),
    header = require('gulp-header'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    log = require('fancy-log'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream');


// Source and Additional variables
var env,
    outputDir,
    productionBuild,
    sassStyle,
    pagesDeep;

env = process.env.NODE_ENV || 'development';

if (env === 'production') {
    outputDir = 'builds/prod/';
    sassStyle = 'compressed'
    productionBuild = true;
} else {
    outputDir = 'builds/dev/';
    sassStyle = 'expanded'
    productionBuild = false;
};

// Source Locations
var paths = {
    ui: {
        src: 'builds/dev/img/*',
        dest: 'builds/prod/img/'
    },
    images: {
        src: 'builds/dev/images/*',
        dest: 'builds/prod/images/'
    },
    pages: {
        src: 'src/pages/*.html',
        srcdeep: 'src/pages/**/*.html',
        dest: outputDir
    },
    styles: {
        src: ['src/sass/**/*.scss'],
        dest: outputDir + 'css/'
    },
    scripts: {
        src: ['node_modules/jquery/dist/jquery.js', 'src/scripts/*.js'],
        dest: outputDir + 'js/'
    }
};

pagesDeep = 'src/pages/**/*.html';

/* JavaScript */
function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(gulpif(productionBuild, uglify()))
        .pipe(concat('main.js'))
        .pipe(gulpif(productionBuild, rename({ suffix: '.min' })))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(connect.reload());
}


/* Styles */
function styles() {
    return gulp.src(paths.styles.src)
        // .pipe(sass().on('error', sass.logError))
        .pipe(compass({
                css: paths.styles.dest,
                sass: 'src/sass',
                comments: true,
                require: ['font-awesome-sass', 'sass-timestamp', 'sassy-math'],
                font: outputDir + 'fonts',
                image: paths.images.dest,
                style: sassStyle
            })
            .on('error', log))
        .pipe(clean())
        .pipe(gulpif(productionBuild,
            postcss([autoprefixer({ browsers: 'last 4 versions', grid: true })])
        ))
        .pipe(gulpif(productionBuild,
            rename({ suffix: '.min' })
        ))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(connect.reload());
}


/* HTML Pages */
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
        .pipe(connect.reload());
}

function compression() {

    var imagefiles = gulp.src(paths.images.src)
        .pipe(gulpif(productionBuild, imagemin(imagemin.jpegtran({ progressive: true }))))
        .pipe(gulpif(productionBuild, gulp.dest(paths.images.dest)));

    var imgfiles = gulp.src(paths.ui.src)
        .pipe(gulpif(productionBuild, imagemin()))
        .pipe(gulpif(productionBuild, gulp.dest(paths.ui.dest)));

    return merge(imagefiles, imgfiles);
}




// Server for livereload
function connectServer(cb) {
    connect.server({
        root: outputDir,
        livereload: true
    });

    cb();
}

// Watch everything
function watch(cb) {
    gulp.watch(paths.pages.srcdeep, pages);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.ui.src, compression);
    gulp.watch(paths.images.src, compression);

    cb();
}


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(pages, styles, scripts, compression, connectServer, watch);

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.pages = pages;
exports.scripts = scripts;
exports.styles = styles;
exports.images = compression;
exports.ui = compression;
exports.watch = watch;
exports.connect = connectServer;
exports.build = build;

/*
 * Define default task that can be called by just running `gulp` from cli
 */

exports.default = build;