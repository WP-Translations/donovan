// Include gulp
var gulp = require('gulp');

// Include plugins
var autoprefixer = require( 'autoprefixer' );
var rename       = require( 'gulp-rename' );
var replace      = require( 'gulp-replace' );
var concat       = require( 'gulp-concat' );
var uglify       = require( 'gulp-uglify' );
var rtlcss       = require( 'gulp-rtlcss' );
var sass         = require( 'gulp-sass' );
var postcss      = require( 'gulp-postcss' );
var sorting      = require( 'postcss-sorting' );
var wprtl        = require( 'postcss-wprtl' );

// Minify JS
gulp.task( 'minifyjs', function() {
	return gulp.src( ['assets/js/navigation.js'] )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: '.min'
		} ) )
		.pipe( gulp.dest('assets/js') );
});

// Clean up CSS
gulp.task( 'cleancss', function() {
	return gulp.src( ['style.css', 'assets/css/*.css'], { base: './' } )
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( postcss( [ sorting( { 'preserve-empty-lines-between-children-rules': true } ) ] ) )
		.pipe( gulp.dest( './' ) );
});

// WP RTL
gulp.task( 'wprtl', function () {
	return gulp.src( ['style.css'] )
		.pipe( concat( 'rtl.css' ) )
		.pipe( postcss( [ wprtl() ] ) )
		.pipe( postcss( [ sorting( { 'preserve-empty-lines-between-children-rules': true } ) ] ) )
		.pipe( gulp.dest( './' ) );
});

// Sass Bundler
gulp.task( 'sass', function() {
    return gulp.src( 'sass/style.scss' )
        .pipe( sass( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( rename( 'style.css' ) )
		.pipe( postcss( [ sorting() ] ) )
		.pipe( replace( '  ', '	' ) )
		.pipe( replace( '}\n	', '}\n\n	' ) )
		.pipe( replace( '}\n\n	}', '}\n	}' ) )
		.pipe( replace( '*/\n/*', '*/\n\n/*' ) )
		.pipe( replace( ';\n	/*', '; /*' ) )
        .pipe( gulp.dest( './' ) )
});

// Sass Watch
gulp.task('sass:watch', function () {
  gulp.watch( 'sass/**/*.scss', ['sass']);
});

// Lint CSS
gulp.task( 'lintcss', function lintCssTask() {
  const gulpStylelint = require( 'gulp-stylelint' );

  return gulp
    .src( 'style.css' )
    .pipe( gulpStylelint( {
		reporters: [
			{formatter: 'string', console: true}
		]
	} ) )
});

// Default Task
gulp.task( 'default', ['minifyjs', 'cleancss'] );
