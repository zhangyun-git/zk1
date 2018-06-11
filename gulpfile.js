var gulp = require('gulp'); // 引入gulp
var server = require('gulp-webserver'); // 起服务
var sass = require('gulp-sass'); // 操作scss文件
var mincss = require('gulp-clean-css'); // 压缩css文件
var concat = require('gulp-concat'); // 合并文件
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