// 引入模块
const
	gulp = require("gulp"),//requires the core Gulp library需要核心gulp库
	babel = require("gulp-babel"),
	uglify = require("gulp-uglify"),
	htmlmin = require("gulp-htmlmin"),
	sass = require("gulp-sass"),
	connect = require("gulp-connect");//定制浏览器自动刷新任务。通过在本地开启一个websocket服务，检测文件变化，当文件被修改后触发livereload任务，推送消息给浏览器刷新页面

// 定制任务：压缩JS
gulp.task("js", () => {
	gulp.src("src/js/**/*.js")//找到路径为"src/js/**/*.js"的所有文件
		.pipe(babel({
			presets: ['@babel/env']
		}))//pipe理解为管道，上一步处理完的数据会进来继续处理，
		// 处理完毕流到下一个管道。所有这里先pipe(babel({presets: 
		// ['@babel/env']}))是用js()函数处理上一步匹配到的数据
		.pipe(uglify())//.pipe(uglify())用uglify()函数处理上一步流过来的数据
		.pipe(gulp.dest("dist/js"))//继续处理流过来的数据，通过dest方法把他们输出到"dist/js"目录
		.pipe(connect.reload());//继续处理流过来的数据，然后执行浏览器刷新任务。
});

// 编译*.scss文件
gulp.task("sass", () => {
	gulp.src("src/sass/**/*.scss")
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(gulp.dest("dist/css"))
		.pipe(connect.reload());
});

// 压缩HTML文件
gulp.task("html", () => {
	gulp.src("src/**/*.html")
		.pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
		.pipe(gulp.dest("dist/"))
		.pipe(connect.reload());
});


// 将 src 下的 images、lib、css 复制到 dist 目录下
gulp.task("copy-images", () => {
	gulp.src("src/images/**/*.*")
		.pipe(gulp.dest("dist/images"));
});
gulp.task("copy-lib", () => {
	gulp.src("src/lib/**/*.*")
		.pipe(gulp.dest("dist/lib"));
});
gulp.task("copy-css", () => {
	gulp.src("src/css/**/*.*")
		.pipe(gulp.dest("dist/css"));
});
gulp.task("copy-font", () => {
	gulp.src("src/font/**/*.*")
		.pipe(gulp.dest("dist/font"));
});

//定义复制文件任务，调用"copy-images", "copy-lib", "copy-css","copy-font"任务
gulp.task("copy", ["copy-images", "copy-lib", "copy-css", "copy-font"]);

// 启动 webserver
gulp.task('server', function () {
	connect.server({
		root: "dist",
		port: 8080,
		livereload: true
	});
});

// 监视任务
gulp.task("watch", () => {
	// 监听 sass 文件夹下的 *.scss文件的修改，当有修改文件，则执行 "sass" 任务
	gulp.watch("src/sass/**/*.scss", ["sass"]);
	// 监听html文件修改
	gulp.watch("src/**/*.html", ["html"]);
	// 监听js修改
	gulp.watch("src/js/**/*.js", ["js"]);
});

// 默认任务，调用上面所有任务
gulp.task("default", ["sass", "js", "html", "copy", "server", "watch"]);