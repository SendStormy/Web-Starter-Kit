'use strict';

var gulp 				= require('gulp'), // Connect Gulp
		browserSync = require('browser-sync').create(), // Include browserSync
		uncss				=	require('gulp-uncss'), // Remove useless css from project
		concatCSS 	= require('gulp-concat-css'), // Merge all Css to one
		concat 			= require('gulp-concat'), // Plugin for concatination
		uglify			=	require('gulp-uglify'), // Minimize Js
		rename			=	require('gulp-rename'), // Rename our Css
		del 				=	require('del'), // Library for removing files and folders
		cache				=	require('gulp-cache'), // Connecting library for caching
		notify			=	require('gulp-notify'), // Makes beautifull notifications
		prefix			=	require('gulp-autoprefixer'), // Puts autoprefix to css properties
		sass				=	require('gulp-sass'), // Installing Sass
		bourbon			=	require('node-bourbon'), // Adding bourbon mixins
		minifyCSS 	= require('gulp-minify-css'), // Minimize Css
		htmlmin			= require('gulp-htmlmin'), // Minimize Html
		imagemin		=	require('gulp-imagemin'); // Minimize img

// Developing 
gulp.task('sass', function() {
  gulp.src('app/sass/**/*.sass') // Collecting all Sass files
    .pipe(sass({includePaths: require('node-bourbon').includePaths})) // Launch Sass
    .on('error', function (error) { // Event on error
    	console.log(error); // Output errors into console
    	this.end(); // Looping action
    	}) // Sass error catcing option
    .pipe(prefix(['last 15 versions', '>1%', 'ie 8', 'ie 7'])) // Adding vendor prefixes
    .pipe(minifyCSS('')) // Compressing Css
    .pipe(rename('style.min.css')) // Rename our Css
    .pipe(gulp.dest('app/css')) // Unload Css
    .pipe(browserSync.reload({stream: true})) // Add automatic reload
});

gulp.task('scripts', function() {
	return gulp.src([ // Collecting Js all libs
			'app/libs/jquery/dist/jquery.min.js', // Jquery
			'app/libs/bootstrap/dist/js/bootstrap.min.js', // Bootstrap Js
		])
	.pipe(concat('libs.min.js')) // Collecting all Js libs in new file libs.min.js
	.pipe(uglify()) // Minimize Js
	.pipe(gulp.dest('app/js')); // Deploy in folder app/js
});

gulp.task('compress', function() {
	return gulp.src('app/js/common.js') // Collecting custom script
		.pipe(rename('common.min.js')) // Create new renamed file with custom Js
		.pipe(uglify()) // Minimize custom Js
		.pipe(gulp.dest('app/js')) // Deploy custom js in folder app/js
		.pipe(browserSync.reload({stream: true})) // Add automatic reload
});

gulp.task('css-libs', function() {
	return gulp.src([ // Collecting Css libs
			'app/libs/bootstrap/dist/css/bootstrap.min.css', // Add bootstrap
			'app/libs/font-awesome/css/font-awesome.css', // Add font awesome
		])
	.pipe(concat('libs.min.css')) // Collecting all Css libs in new file libs.min.css
	.pipe(minifyCSS('')) // Compressing Css
	.pipe(gulp.dest('app/css')) // Deploy in folder app/css
});

gulp.task('browser-sync', function() { // Create task for browser-sync
    browserSync.init({ // Perform browser-sync
        server: { // Define server parameters
        	baseDir: "app" // Server dir
        },
        notify: false // Disable notification
    });
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'compress'], function () {
	gulp.watch('app//sass/**/*.sass', ['sass']) // Start to watch for changes in .css
	gulp.watch('app/*.html', browserSync.reload) // Start to watch for changes in .html
	gulp.watch('app/js/**/*.js', ['compress']) // Start to watch for changes in .js
	gulp.watch('app/img/**/*', browserSync.reload) // Start to watch for changes in img folder
});

gulp.task('default', ['watch']);

// Production
gulp.task('clean', function() {
	return del.sync('dist'); // Removing Dist folder before assembly
});

gulp.task('htmlmin', function() {
	return gulp.src('app/*.html') // Search all Html files
		.pipe(htmlmin({
			removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
		})) // Compressing Html files
		.pipe(gulp.dest('dist')); // Transfering all HTML into dist folder
});

gulp.task('imgmin', () =>
	gulp.src('app/img/**/*') // Collecting all the imgmin
		.pipe(cache(imagemin([
    	imagemin.gifsicle({interlaced: true}),
    	imagemin.jpegtran({progressive: true}),
    	imagemin.optipng({optimizationLevel: 3}),
    	imagemin.svgo({plugins: [{removeViewBox: true}]})
		])))
		.pipe(gulp.dest('dist/img'))
);

gulp.task('build', ['clean', 'imgmin', 'htmlmin'], function() {
	var buildCss = gulp.src([ // Transfering selected CSS into dist folder
			'app/css/style.min.css', // All dev Css
			'app/css/libs.min.css' // All libs Css
		])
		.pipe(uncss({
    		html: ['app/index.html'] // Remove useless css from project
    }))
		.pipe(gulp.dest('dist/css')) // Pipe for dest

	var buildFonts = gulp.src('app/fonts/**/*') // Transfering all fonts into dist folder
		.pipe(gulp.dest('dist/fonts')) // Pipe for dest

	var buildJs = gulp.src([
			'app/js/libs.min.js', // Add libs Js
			'app/js/common.min.js' // Custom Js
		]) // Transfering all Js into dist folder
		.pipe(gulp.dest('dist/js')) // Pipe for dest

	var buildhtaccess = gulp.src('app/.htaccess') // Transfering ht.access into dist folder
		.pipe(gulp.dest('dist'))
});

// Clean cache
gulp.task('clear', function() {
	return cache.clearAll();
});