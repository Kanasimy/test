const   gulp = require('gulp'),
        plumber = require('gulp-plumber'),
        clean = require("gulp-clean"),
        sass = require('gulp-sass'),
        cssmin = require('gulp-cssmin'),
        rename = require('gulp-rename'),
        imagemin = require('gulp-imagemin'),
        webp = require("gulp-webp"),
        svgstore = require("gulp-svgstore"),
        sync = require("browser-sync").create(),
        pug = require('gulp-pug'),
        pugLinter = require('gulp-pug-linter'),
        terser = require("gulp-terser");

const paths = {
    sass:['src/sass/*.scss'],
    css:['build/css'],
    html:['src/*.html'],
    template:['src/pages/*.pug'],
    img:['src/img/*']
};

//конфигурация сервера
const config = {
    server: {
        baseDir: "build/"
    },
    tunnel: false,
    browser: 'chrome',
    host: 'localhost',
    port: 3000,
    logPrefix: "olga_yuzich"
};

const server = (done) => {
    sync.init(config);
    done();
}

exports.server = server;

const reload = (done) => {
    sync.reload();
    done();
}

exports.reload = reload;



// HTML
const html = () => {
    return gulp.src(paths.template)
        .pipe(plumber())
        .pipe(pugLinter({ reporter: 'default' }))
        .pipe(pug())
        .pipe(gulp.dest('build'))
}

exports.html = html;

const img = (done) => {
    gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
    done()
}

exports.img = img;

const copyImg = (done) => {
    gulp.src(paths.img)
        .pipe(gulp.dest('build/img'));
    done();
}

exports.copyImg = copyImg;

const webpImg = () => {
    return gulp.src("src/img/**/*.{jpg,png}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"))
}

exports.webpImg = webpImg;

const sprite = () => {
    return gulp.src("src/img/svg/*.svg")
        .pipe(svgstore({
            inLineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

const css = () => {
   return gulp.src(paths.sass)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.css))
};

exports.css = css;

const copyScript = (done) => {
    gulp.src("src/js/*")
        .pipe(gulp.dest('build/js'));
    done();
}

exports.copyScript = copyScript;

// Clean build

const cleanBuild = (done) => {
    return gulp.src("./build", {read: false, allowEmpty: true})
        .pipe(clean());
        done();
};

exports.cleanBuild = cleanBuild;

// Watcher

const watcher = () => {
    gulp.watch(paths.img, gulp.series(copyImg, reload))
    gulp.watch('src/img/svg/*.svg', gulp.series(sprite, reload))
    gulp.watch('src/sass/**/*.scss', gulp.series(css, reload))
    gulp.watch('src/js/**/*.js', gulp.series(copyScript, reload))
    gulp.watch('src/pages/**/*.pug', gulp.series(html, reload))
}

exports.watcher = watcher;

exports.default = gulp.series(
    gulp.parallel(
        css,
        html,
        copyScript,
        sprite,
        copyImg
    ),
    gulp.series(
        server,
        watcher
    )
);

exports.build = gulp.series(
    cleanBuild,
    gulp.parallel(
        css,
        html,
        copyScript,
        sprite,
        img,
        webpImg
    ),
    gulp.series(
        server
    )
);
