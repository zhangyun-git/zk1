var gulp = require('gulp'); // 引入gulp
var server = require('gulp-webserver'); // 起服务
var sass = require('gulp-sass'); // 操作scss文件
var mincss = require('gulp-clean-css'); // 压缩css文件
var uglify = require('gulp-uglify');// 压缩js文件
var htmlmin = require('gulp-htmlmin'); // 压缩html
var concat = require('gulp-concat'); // 合并文件
var clean = require('gulp-clean'); // 删除指定文件
var sequence = require('gulp-sequence'); // 设置gulp任务的执行顺序
var path = require('path'); // 引入path路径
var fs = require('fs'); // 引入fs内置模块
var url = require('url');


// 开发环境 起服务
gulp.task('devserver',['devSass'],function(){
    gulp.src('src')
    .pipe(server({
        port:9090, // 配置端口号
        open:true, // 自动打开浏览器
        livereload:true, // 自动刷新页面
        middleware:function(req,res,next){ // 拦截前端数据
            var pathname = url.parse(req.url).pathname;
            if(pathname === '/favicon.ico'){
                return;
            }
            pathname = pathname === '/' ? 'index.html' : pathname;
            res.end(fs.readFileSync(path.join(__dirname,'src',pathname)))
        }   
    }))
})

// 开发环境 编译scss文件
gulp.task('devSass',function(){
    gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
})

// 线上环境 起服务
gulp.task('buildserver',['buildcss'],function(){
    return gulp.src('build')
    .pipe(server({
        port:9090, // 配置端口号
        open:true, // 自动打开浏览器
        livereload:true, // 自动刷新页面
        middleware:function(req,res,next){ // 拦截前端数据
            var pathname = url.parse(req.url).pathname;
            if(pathname === '/favicon.ico'){
                return;
            }
            pathname = pathname === '/' ? 'index.html' : pathname;
            res.end(fs.readFileSync(path.join(__dirname,'build',pathname)))
        }   
    }))
})

// 操作css 
gulp.task('buildcss',function(){
    return gulp.src('src/css/*.css')
    .pipe(concat('all.css')) // 合并css文件
    .pipe(mincss()) // 压缩css
    .pipe(gulp.dest('build/css')) // 输出到目标文件
})

// 操作js
gulp.task('builduglify',function(){
    return gulp.src('src/js/*.js')
    .pipe(concat('all.js')) // 合并js文件
    .pipe(uglify()) // 压缩js
    .pipe(gulp.dest('build/js')) // 输出到目标文件
})

// 删除指定文件
gulp.task('clean',function(){
    return gulp.src('build')
    .pipe(clean())
})

// 操作html
gulp.task('htmlmin',function(){
    return gulp.src('src/**/*.html') // 找到要操作的文件
    .pipe(htmlmin({ // 压缩html
        collapseWhitespace:true
    }))
    .pipe(gulp.dest('build')) // 输出到目标文件
})

// 线上环境的执行顺序
gulp.task('build',function(cb){
    sequence('clean',['buildcss','builduglify'],'htmlmin','buildserver',cb)
})