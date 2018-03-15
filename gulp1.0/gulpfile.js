var gulp = require('gulp')
var $ = require('gulp-load-plugins')() //执行自动加载插件
var open = require('open')

var app = {
  srcPath: 'src/',
  devPath: 'build/',
  prdPath: 'dist/'
}

//执行lib任务
gulp.task('lib', function() {
  // 关于gulp.dest:

  // 首先通过gulp.src()方法获取到我们想要处理的文件流，
  // 然后把文件流通过pipe方法导入到gulp的插件中，
  // 最后把经过插件处理后的流再通过pipe方法导入到gulp.dest()中，
  // 1.gulp.dest()方法则把流中的内容写入到文件中，
  // 这里首先需要弄清楚的一点是，我们给gulp.dest()传入的路径参数，
  // 2.只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，
  // 它生成文件的文件名使用的是导入到它的文件流自身的文件名，
  // 所以生成的文件名是由导入到它的文件流决定的，
  // 即使我们给它传入一个带有文件名的路径参数，
  // 然后它也会把这个文件名当做是目录名，例如：
  // var gulp = require('gulp');
  //   gulp.src('script/jquery.js')
  //   .pipe(gulp.dest('dist/foo.js'));
  //最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
  //  //加载路径文件 所有bower目录下的js文件
  gulp.src('bower_components/**/*.js')

  .pipe(gulp.dest(app.devPath + 'vendor'))
  .pipe(gulp.dest(app.prdPath + 'vendor'))
  //
  .pipe($.connect.reload());
})

gulp.task('html', function() {
  //关于gulp.src

  //gulp.src(script/lib/*.js, {base:'script'}) //配置了base参数，此时base路径为script
      //假设匹配到的文件为script/lib/jquery.js
      //.pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js
  gulp.src(app.srcPath + '**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload())//自动加载，//自动刷新
})

gulp.task('json', function() {
  gulp.src(app.srcPath + 'data/**/*.json')//想清楚文件放哪里
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload())
})

gulp.task('less', function() {
  gulp.src(app.srcPath + 'style/index.less')//样式入口文件
    //默认在执行任务时，如果出错，就会挂起，要重新启动需要重新输入 gulp 命令，
    //这时我们可以用 gulp-plumber 插件。
    //http://www.cnblogs.com/zichi/p/6250504.html
    .pipe($.plumber())
    .pipe($.less())//加载less编译
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.cssmin())//压缩css
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload());
})

gulp.task('less', function() {
  gulp.src(app.srcPath + 'style/index.less')
  .pipe($.plumber())
  .pipe($.less())
  .pipe(gulp.dest(app.devPath + 'css'))
  .pipe($.cssmin())
  .pipe(gulp.dest(app.prdPath + 'css'))
  .pipe($.connect.reload());
});

gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('index.js'))//合并
    .pipe(gulp.dest(app.devPath + 'js'))//发布到开发环境
    .pipe($.uglify())//压缩
    .pipe(gulp.dest(app.prdPath + 'js'))//发布到生产环境
    .pipe($.connect.reload());
});

gulp.task('image', function() {
  gulp.src(app.srcPath + 'image/**/*')
  .pipe($.plumber())
  .pipe(gulp.dest(app.devPath + 'image'))
  .pipe($.uglify())
  .pipe($.imagemin())//压缩图片
  .pipe(gulp.dest(app.prdPath + 'image'))
  .pipe($.connect.reload());
})

//项目输出build
gulp.task('build', ['image','js','less','lib','html','json']);

//清除文件
gulp.task('clean', function() {
  gulp.src([app.devPath, app.prdPath])
  .pipe($.clear());
})

//定义前端端口

gulp.task('serve', ['build'], function() {
  $.connect.server({
    root: [app.devPath],
    livereload: true,
    port: 9330
  });

  open('http://localhost:9330');

  gulp.watch('bower_components/**/*', ['lib']);
  gulp.watch(app.srcPath + '**/*.html', ['html']);
  gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
  gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
  gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
  gulp.watch(app.srcPath + 'image/**/*', ['image']);

})

//定义默认命令
gulp.task('default', ['serve']);



//一堆
