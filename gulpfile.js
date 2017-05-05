var gulp 			= require('gulp'), // Connect Gulp
		concatCSS = require('gulp-concat-css'), // Merge all Css to one
		rename		=	require('gulp-rename'), // Rename our Css
		notify		=	require('gulp-notify'), // Makes beautifull notifications
		prefix		=	require('gulp-autoprefixer'), // Puts autoprefix to css properties
		minifyCSS = require('gulp-minify-css'),
		sass			= require('gulp-sass'); // Minimize Css
 
gulp.task('default', function () {
  gulp.src('app/css/*.css') // Collecting all Css
    .pipe(concatCSS("css/bundle.css")) // Merge all Css to one
    .pipe(prefix(['last 15 versions', '>1%', 'ie 8', 'ie 7'])) // Adding vendor prefixes
    .pipe(minifyCSS('')) // Compressing Css
    .pipe(rename('bundle.min.css')) // Rename our Css
    .pipe(gulp.dest('app/css')) // Unload Css
    .pipe(notify('Done!')); // If success alert Done!
});

gulp.task('watch', function () {
	gulp.watch('css/*.css', ['default']) // Start to watch for changes in .css
});