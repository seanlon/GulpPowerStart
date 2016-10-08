var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var browserSyncReport = require('browser-sync') ;
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
var prefix = require('gulp-autoprefixer') ; 
var minifyHTML  = require('gulp-minify-html') ;
var imageMin = require('gulp-imagemin') ; var pngquant    = require('imagemin-pngquant');
var stripDebug = require('gulp-strip-debug');
var coffeelint = require('gulp-coffeelint'); 
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

var ngrok     = require('ngrok');
var psi       = require('psi'); 
var siteUrl      = 'http://speedtest.net';
var sitePort   = 3000;


var INPUT_PATH = './src';
var OUTPUT_PATH = './dist';
var NODE_PATH = './node_modules';


gulp.task('report', ['clean'], function(cb) {
    runSequence('serve-prod', 'run-pagespeed',cb);
});
gulp.task('dev', ['clean'], function(cb) {
    runSequence('serve-dev', 'browsersync',cb);
});

gulp.task('prod', ['clean'], function(cb) {
    runSequence('serve-prod', 'browsersync', cb);
});

gulp.task('serve-prod', ['generate-font-resource', 'generate-includes-resource','minify-image', 'minify-html','generate-html-resource', 'script-production', 'styles-production'], function() {
    console.log('bundled production');  
});

gulp.task('serve-dev', ['generate-font-resource', 'generate-includes-resource',  'generate-html-resource', 'script', 'styles' ], function() {

   console.log('bundled development');  
    gulp.watch(INPUT_PATH + '/sass/**/*.scss', ['styles']);
    gulp.watch(INPUT_PATH + '/*.html', ['generate-html-resource', reload]);

    gulp.watch(INPUT_PATH + '/script/**/*.coffee', ['script', reload]);
    gulp.watch(INPUT_PATH + '/js/**/*.js', ['script', reload]);
});

gulp.task('browsersync', function (cb) {
    browserSync.init({
        server: OUTPUT_PATH , open: false,  port: sitePort
    });
});

gulp.task('browsersync-psi',  function() {
 
    browserSyncReport({server: OUTPUT_PATH, open: false,  port: sitePort}, function(err, bs) {
        // console.log(bs.options.getIn(["urls", "local"]));
    });
 
});
gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(sitePort, function (err, url) {
    siteUrl = url;
    console.log('Tunnel serve from: ' + url);
    cb();
  });
});




gulp.task('psi-general', function (cb) {
     // get the PageSpeed Insights report
    psi.output(siteUrl).then(data => {
      console.log(data.ruleGroups.SPEED.score);
      console.log(data.pageStats);
    });

    // output a formatted report to the terminal
    psi.output(siteUrl, {nokey: 'true', strategy: 'desktop'}).then(() => {
      console.log('done');
    }); 

});


gulp.task('psi-desktop', function (cb) {
    // Supply options to PSI and get back speed and usability scores
    psi(siteUrl, {nokey: 'true', strategy: 'mobile'}).then(data => {
      console.log('Speed score: ' + data.ruleGroups.SPEED.score);
      console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('psi-mobile', function (cb) {
    // Supply options to PSI and get back speed and usability scores
    psi(siteUrl, {nokey: 'true', strategy: 'desktop'}).then(data => {
      console.log('Speed score: ' + data.ruleGroups.SPEED.score);
      console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('run-pagespeed', function (cb) {
  return runSequence( 
    'browsersync-psi',
    'ngrok-url',
    'psi-general', 
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

gulp.task('minify-image', function () {
    return gulp.src(INPUT_PATH + '/image/**/*')
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(OUTPUT_PATH + '/image'))
});

gulp.task('minify-html', function() {
    var opts = {
      comments:true,
      spare:true
    };

  gulp.src(INPUT_PATH + '/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(OUTPUT_PATH))
    .pipe(reload({stream:true}));
 


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
        .pipe(prefix())
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
