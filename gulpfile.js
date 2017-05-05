var gulp 				= require('gulp'), // Connect Gulp
		browserSync = require('browser-sync').create(), // Include browserSync
		concatCSS 	= require('gulp-concat-css'), // Merge all Css to one
		rename			=	require('gulp-rename'), // Rename our Css
		notify			=	require('gulp-notify'), // Makes beautifull notifications
		prefix			=	require('gulp-autoprefixer'), // Puts autoprefix to css properties
		minifyCSS 	= require('gulp-minify-css'); // Minimize Css
 
gulp.task('default', function () {
  gulp.src('app/css/*.css') // Collecting all Css
    .pipe(concatCSS("css/bundle.css")) // Merge all Css to one
    .pipe(prefix(['last 15 versions', '>1%', 'ie 8', 'ie 7'])) // Adding vendor prefixes
    .pipe(minifyCSS('')) // Compressing Css
    .pipe(rename('bundle.min.css')) // Rename our Css
    .pipe(gulp.dest('app/css')) // Unload Css
    .pipe(browserSync.reload({stream: true})) // Add automatic reload
    .pipe(notify('Done!')); // If success alert Done!
});

gulp.task('browser-sync', function() { // Create task for browser-sync
    browserSync.init({ // Perform browser-sync
        server: { // Define server parameters
            baseDir: "app" // Server dir
        }
    });
});

gulp.task('watch', ['browser-sync'], function () {
	gulp.watch('css/*.css', ['css']) // Start to watch for changes in .css
	gulp.watch('app/*.html', browserSync.reload) // Start to watch for changes in .html
	gulp.watch('app/js/**/*.js', browserSync.reload) // Start to watch for changes in .js
});