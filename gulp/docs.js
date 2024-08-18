const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

gulp.task("html:docs", () => {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./docs/"))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./docs/"));
});

gulp.task("sass:docs", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css"))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("images:docs", () => {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./docs/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("fonts:docs", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", () => {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

gulp.task("js:docs", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(gulp.dest("./docs/js"));
});

gulp.task("server:docs", () => {
  return gulp.src("./docs/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

gulp.task("clean:docs", (done) => {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

gulp.task("watch:docs", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:docs"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:docs"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:docs"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:docs"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:docs"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:docs"));
});


