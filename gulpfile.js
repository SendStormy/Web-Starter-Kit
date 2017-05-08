var gulp 				= require('gulp'), // Connect Gulp
		browserSync = require('browser-sync').create(), // Include browserSync
		uncss				=	require('gulp-uncss'), // Remove useless css from project
		concatCSS 	= require('gulp-concat-css'), // Merge all Css to one
		concat 			= require('gulp-concat'), // Plugin for concatination
		uglify			=	require('gulp-uglify'), // Minimize Js
		rename			=	require('gulp-rename'), // Rename our Css
		notify			=	require('gulp-notify'), // Makes beautifull notifications
		prefix			=	require('gulp-autoprefixer'), // Puts autoprefix to css properties
		sass				=	require('gulp-sass'), // Installing Sass
		minifyCSS 	= require('gulp-minify-css'); // Minimize Css
 
gulp.task('sass', function () {
  gulp.src('app/sass/**/*.sass') // Collecting all Sass files
    .pipe(sass()) // Launch Sass
    .on('error', function (error) {
    	console.log(error);
    	this.end();
    	}) // Sass error catcing option
    .pipe(prefix(['last 15 versions', '>1%', 'ie 8', 'ie 7'])) // Adding vendor prefixes
    .pipe(minifyCSS('')) // Compressing Css
    .pipe(rename('style.min.css')) // Rename our Css
    .pipe(uncss({
    		html: ['app/index.html'] // Remove useless css from project
    }))
    .pipe(gulp.dest('app/css')) // Unload Css
    .pipe(browserSync.reload({stream: true})) // Add automatic reload
    .pipe(notify('Done!')); // If success alert Done!
});

gulp.task('scripts', function () {
	return gulp.src([ // Collecting all libs
			'app/libs/jquery/jquery-1.11.1.min.js', // Jquery
			'app/libs/jquery-mousewheel/jquery.mousewheel.min.js', // Mousewheel
			'app/libs/html5shiv/html5shiv.min.js', // html5shiv
			'app/libs/owl-carousel/owl.carousel.min.js', // Carusel
			'app/libs/respond/respond.min.js', // Respond
			'app/libs/waypoints/waypoints-1.6.2.min.js', // Waypoints
		])
	.pipe(concat('libs.min.js')) // Collecting all libs in new file libs.min.js
	.pipe(uglify()) // Minimize Js
	.pipe(gulp.dest('app/js')); // Upload to folder app/js
});

gulp.task('browser-sync', function() { // Create task for browser-sync
    browserSync.init({ // Perform browser-sync
        server: { // Define server parameters
            baseDir: "app" // Server dir
        },
        notify: false // Disable notification
    });
});

gulp.task('watch', ['browser-sync'], function () {
	gulp.watch('app//sass/**/*.sass', ['sass']) // Start to watch for changes in .css
	gulp.watch('app/*.html', browserSync.reload) // Start to watch for changes in .html
	gulp.watch('app/js/**/*.js', browserSync.reload) // Start to watch for changes in .js
});