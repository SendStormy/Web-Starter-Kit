var gulp 				= require('gulp'), // Connect Gulp
		browserSync = require('browser-sync').create(), // Include browserSync
		uncss				=	require('gulp-uncss'), // Remove useless css from project
		concatCSS 	= require('gulp-concat-css'), // Merge all Css to one
		rename			=	require('gulp-rename'), // Rename our Css
		notify			=	require('gulp-notify'), // Makes beautifull notifications
		prefix			=	require('gulp-autoprefixer'), // Puts autoprefix to css properties
		sass				=	require('gulp-sass'), // Installing Sass
		minifyCSS 	= require('gulp-minify-css'); // Minimize Css
 
gulp.task('default', function () {
  return gulp.src('app/sass/**/*.sass') // Collecting all Sass files
    .pipe(sass().on('error', sass.logError)) // Launch Sass with error catcing option
    .pipe(prefix(['last 15 versions', '>1%', 'ie 8', 'ie 7'])) // Adding vendor prefixes
    .pipe(minifyCSS('')) // Compressing Css
    .pipe(rename('style.min.css')) // Rename our Css
    .pipe(uncss({
    		html: ['app/index.html']
    }))
    .pipe(gulp.dest('app/css')) // Unload Css
    .pipe(browserSync.reload({stream: true})) // Add automatic reload
    .pipe(notify('Done!')); // If success alert Done!
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
	gulp.watch('css/*.css', ['css']) // Start to watch for changes in .css
	gulp.watch('app/*.html', browserSync.reload) // Start to watch for changes in .html
	gulp.watch('app/js/**/*.js', browserSync.reload) // Start to watch for changes in .js
});