const { Transform } = require('stream');
const gulp          = require('gulp'),
	  sass          = require('gulp-sass')(require('sass')),
	  autoprefixer  = require('autoprefixer'),
	  concat        = require('gulp-concat'),
	  fileinclude   = require('gulp-file-include'),
	  gulpif        = require('gulp-if'),
	  postcss       = require('gulp-postcss'),
	  uglify        = require('gulp-uglify'),
	  rename        = require('gulp-rename'),
	  browserSync   = require('browser-sync').create();

let env, outputDir, productionBuild, sassStyle;
env = process.env.NODE_ENV || 'development';
if (env === 'production') { outputDir='dist/prod/'; sassStyle='compressed'; productionBuild=true; }
else { outputDir='dist/dev/'; sassStyle='expanded'; productionBuild=false; }

const paths = {
	ui:     { src:'src/img/*', dest:outputDir+'img/' },
	pages:  { src:'src/html/*.html', includes:'src/includes/', dest:outputDir },
	styles: { src:['src/scss/**/*.scss'], dest:outputDir+'css/' },
	scripts:{ src:['node_modules/jquery/dist/jquery.js','src/scripts/*.js'], dest:outputDir+'js/' }
};


// Zero-dependency build banner (replaces gulp-header-comment / moment / lodash)
function buildStamp(tz = 'America/Los_Angeles') {
	const d = new Date();
	const p = new Intl.DateTimeFormat('en-CA', {
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit', second: '2-digit',
		hour12: false, timeZone: tz
	}).formatToParts(d).reduce((o, x) => (o[x.type] = x.value, o), {});
	const off = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
		.formatToParts(d).find(x => x.type === 'timeZoneName').value.replace('GMT', '') || '+00:00';
	const hh = p.hour === '24' ? '00' : p.hour;
	return `${p.year}-${p.month}-${p.day} ${hh}:${p.minute}:${p.second} ${off}`;
}

function prependBanner(text) {
	const body = text.split('\n').map(l => ' * ' + l).join('\n');
	const banner = '/**\n' + body + '\n */\n';
	return new Transform({
		objectMode: true,
		transform(file, _enc, cb) {
			if (file.isBuffer()) {
				file.contents = Buffer.concat([Buffer.from(banner), file.contents]);
			}
			cb(null, file);
		}
	});
}

function style() {
	return gulp.src(paths.styles.src, { sourcemaps: !productionBuild })
		.pipe(sass({ quietDeps: true, style: sassStyle }).on('error', sass.logError))
		.pipe(prependBanner(`CSS Compiled on: ${buildStamp()}
============================================================================== *`))
		.pipe(gulpif(productionBuild, postcss([autoprefixer()])))
		.pipe(gulpif(productionBuild, rename({ suffix: '.min' })))
		.pipe(gulp.dest(paths.styles.dest, { sourcemaps: productionBuild ? false : '.' }));
}

function scripts() {
	return gulp.src(paths.scripts.src, { sourcemaps: !productionBuild })
		.pipe(gulpif(productionBuild, uglify()))
		.pipe(concat('main.js'))
		.pipe(gulpif(productionBuild, rename({ suffix: '.min' })))
		.pipe(gulp.dest(paths.scripts.dest, { sourcemaps: productionBuild ? false : '.' }));
}

function pages() {
	return gulp.src(paths.pages.src)
		.pipe(fileinclude({ prefix:'@@', basepath:paths.pages.includes, context:{ compression:productionBuild } }))
		.pipe(gulp.dest(paths.pages.dest));
}

function replenishImg() {
	return gulp.src(paths.ui.src, { encoding: false })
		.pipe(gulp.dest(paths.ui.dest));
}
function replenishIcons() {
	return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*', { encoding: false })
		.pipe(gulp.dest(outputDir + 'webfonts/'));
}
const replenish = gulp.parallel(replenishImg, replenishIcons);

const build = gulp.parallel(pages, style, scripts, replenish);

function serve(done) {
	browserSync.init({
		server: { baseDir: './' + outputDir }
	});
	done();
}

function reload(done) {
	browserSync.reload();
	done();
}

function watchAll() {
	serve(function () {});
	gulp.watch(paths.styles.src, gulp.series(style, reload));
	gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
	gulp.watch(paths.pages.src, gulp.series(pages, reload));
	gulp.watch(paths.pages.includes + '**/*', gulp.series(pages, reload));
}



exports.style = style;
exports.scripts = scripts;
exports.pages = pages;
exports.replenish = replenish;
exports.serve = serve;
exports.build = build;                       // build once, no server: `gulp build`
exports.watch = gulp.series(build, watchAll);
exports.default = gulp.series(build, watchAll); // `gulp` => build + serve + live-reload