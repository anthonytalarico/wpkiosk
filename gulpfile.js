let gulp 		= require('gulp');
let rename 		= require('gulp-rename');
let sass 		= require('gulp-sass');
let concat 		= require('gulp-concat');
let uglify 		= require('gulp-uglifyes');
let fs 			= require('fs');
let path 		= require('path');

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

function getFolders(dir) {
    return fs.readdirSync(dir)
		.filter(function(file) {
			return fs.statSync(path.join(dir, file)).isFile();
		});
}

let sassPaths = ['node_modules/foundation-sites/scss'];
gulp.task('sass', function() {
  return gulp.src('sass/app.scss')
    .on('error', swallowError)
    .pipe(sass({
      includePaths: sassPaths ,
      outputStyle: 'compressed'
  })).on('error', swallowError)
    .pipe(gulp.dest('dist/css'));
});

// gulp.task('component-sass', function() {
// 	let reactPath = 'sass/components';
// 	let folders = getFolders(reactPath, true);
// 	let tasks = folders.map(function(reactFile) {
// 		return gulp.src(path.join(reactPath,`${reactFile}`))
// 		.on('error', swallowError)
// 		.pipe(sass({ 
// 			outputStyle: 'compressed'
// 		})).on('error', swallowError)
// 		.pipe(rename(`${reactFile.replace(".scss", "")}.css`))
// 		.pipe(gulp.dest('dist/css/components'))
// 	});
// });

gulp.task("copy-libs", function(){
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/dragula/dist/dragula.min.js',
        'node_modules/dragula/dist/dragula.min.css',
        'node_modules/animate.css/animate.min.css'

    ])
    .pipe(gulp.dest('lib'))
    gulp.src([
        'lib/jquery.min.js',
        'lib/dragula.min.js'
    ])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
    gulp.src([
      'lib/animate.min.css',
      'lib/dragula.min.css'
    ])
    .pipe(concat('lib.min.css'))
    .pipe(gulp.dest('dist/css'))
  })
  

gulp.task('watch', function () {
	// gulp.watch('js/**/*.js',['concat-uglify', 'lint']);
	// gulp.watch('views/**/*.pug', ['views']);
	gulp.watch('sass/**/*.{scss,sass}', ['sass']);
});

gulp.task('build', ["sass"]);
gulp.task('runwatch', ['sass']);
gulp.task('default', ["runwatch","watch"]);