var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var $ = require('jquery');
var browserify = require('browserify');
var moduleImporter = require('sass-module-importer');
var runSequence = require('run-sequence').use(gulp);
var source = require('source-map');
var del = require('del');
var glob = require('glob');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var stripDebug = require('gulp-strip-debug');
var coffeelint = require('gulp-coffeelint'); 
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

var INPUT_PATH = './src';
var OUTPUT_PATH = './dist';
var NODE_PATH = './node_modules';



gulp.task('dev', ['clean'], function(cb) {
    runSequence('serve-dev', cb);
});

gulp.task('prod', ['clean'], function(cb) {
    runSequence('serve-prod', cb);
});

gulp.task('serve-prod', ['generate-font-resource', 'generate-includes-resource', 'generate-html-resource', 'script-production', 'styles-production'], function() {
    console.log('bundled production');
    browserSync.init({
        server: OUTPUT_PATH
    });
});

gulp.task('serve-dev', ['generate-font-resource', 'generate-includes-resource', 'generate-html-resource', 'script', 'styles'], function() {
    browserSync.init({
        server: OUTPUT_PATH
    });
    // gulp.watch('/sass/*.scss', ['sass']);
    gulp.watch(INPUT_PATH + '/sass/**/*.scss', ['styles']);
    gulp.watch(INPUT_PATH + '/*.html', ['generate-html-resource', reload]);

    gulp.watch(INPUT_PATH + '/script/**/*.coffee', ['script', reload]);
    gulp.watch(INPUT_PATH + '/js/**/*.js', ['script', reload]);
});



gulp.task('clean-coffeejs', function() {
    return del.sync([INPUT_PATH + '/js/scriptjs/']);
});
gulp.task('clean', function() {
    return del.sync([OUTPUT_PATH + '/**']);
});

gulp.task('generate-html-resource', function() {
    return gulp.src(INPUT_PATH + '/**/*.html')
        .pipe(gulp.dest(OUTPUT_PATH));
});

//assets like images and fonts

gulp.task('generate-includes-resource', function() {
    gulp.src(INPUT_PATH + '/mock/**/*.*')
        .pipe(gulp.dest(OUTPUT_PATH + '/mock'));

    gulp.src(INPUT_PATH + '/images/**/*.*')
        .pipe(gulp.dest(OUTPUT_PATH + '/images'));


    return gulp.src(INPUT_PATH + '/includes/**/*.*')
        .pipe(gulp.dest(OUTPUT_PATH + '/includes'));
});

gulp.task('generate-font-resource', function() {
    return gulp.src(INPUT_PATH + '/fonts/**/*.*')
        .pipe(gulp.dest(OUTPUT_PATH + '/fonts'));
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('styles-production', function() {
    return gulp.src(INPUT_PATH + '/sass/*.scss')
        .pipe(sass({ importer: moduleImporter() }))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest(OUTPUT_PATH + '/css'))
        .pipe(browserSync.stream());
});


gulp.task('styles', function() {
    return gulp.src(INPUT_PATH + '/sass/**/*.scss')
        .pipe(sass({ importer: moduleImporter() }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(OUTPUT_PATH + '/css/'))
        .pipe(browserSync.stream());
});


gulp.task('script-production', ['coffeelint'], function() {

    return browserify({
        entries: [INPUT_PATH + '/script/script.coffee'],
        debug: true,
        extensions: ['.coffee'],
        transform: ['coffeeify']
    })
        .bundle()
        .pipe(source(OUTPUT_PATH + '/js/script.js'))
        .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        .pipe(stripDebug()) // remove console logs and alert
        .pipe(uglify()) // now gulp-uglify works
        .pipe(gulp.dest('')).pipe(browserSync.stream());

});

gulp.task('script', ['coffeelint'], function() {

    return browserify({
        entries: [INPUT_PATH + '/script/script.coffee'],
        debug: true,
        extensions: [".coffee"],
        transform: ["coffeeify"]
    })
        .bundle()
        .pipe(source(OUTPUT_PATH + '/js/script.js'))
        .pipe(gulp.dest('')).pipe(browserSync.stream());

});

gulp.task('coffee', function() {

    gulp.src(INPUT_PATH + '/script/**/**/*.hbs')
        .pipe(gulp.dest(INPUT_PATH + '/js/scriptjs'));

    return gulp.src(INPUT_PATH + '/script/**/**/**.coffee')
        .pipe(coffee({ bare: true }).on('error', function(e) { console.log(e) }))
        .pipe(gulp.dest(INPUT_PATH + '/js/scriptjs'));
});

//convert all coffeescript files into a single js
gulp.task('coffees-js', function() {
    var coffeeFiles = glob.sync('./script/**/*.coffee');
    return browserify({
        entries: [coffeeFiles],
        debug: true,
        extensions: ['.coffee'],
        transform: ['coffeeify']
    })
        .bundle()
        .pipe(source(INPUT_PATH + '/js/scriptScripts.js'))
        .pipe(gulp.dest('')).pipe(browserSync.stream());

});

gulp.task('coffeelint', function() {

    return gulp.src(INPUT_PATH + '/script/**/**/**.coffee')
        .pipe(coffeelint())
        .pipe(coffeelint.reporter())

});

gulp.task('default', ['serve-dev']);
