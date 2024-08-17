const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");

gulp.task("html", () => {
  return gulp
    .src("./src/*.html")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "HTML",
          message: "Error <%= error.message %>",
          sound: false,
        }),
      })
    )
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sass", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Styles",
          message: "Error <%= error.message %>",
          sound: false,
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("images", () => {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./dist/img/"));
});

gulp.task("fonts", () => {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("files", () => {
  return gulp.src("./src/files/**/*").pipe(gulp.dest("./dist/files/"));
});

gulp.task("js", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "JS",
          message: "Error <%= error.message %>",
          sound: false,
        }),
      })
    )
    .pipe(babel())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./dist/js"));
});

gulp.task("server", () => {
  return gulp.src("./dist/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

gulp.task("clean", (done) => {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

gulp.task("watch", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/img/**/*", gulp.parallel("images"));
  gulp.watch("./src/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch("./src/files/**/*", gulp.parallel("files"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images", "fonts", "files", "js"),
    gulp.parallel("server", "watch")
  )
);
