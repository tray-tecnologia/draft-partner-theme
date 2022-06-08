const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const headerComment = require('gulp-header-comment');
const { watch, series, parallel } = require('gulp');
const replace = require('gulp-replace');
const pkgjson = require('./package.json');
const version = pkgjson.version;

const paths = {
    theme: {
        root: './theme',
        sass: './.sass',
        css: './theme/css',
        js: './theme/js',
        elements: './theme/elements',
        config: './theme/configs',
    },
};

const commentTemplate = `
    @theme <%= pkg.theme %>
    @version <%= pkg.version %>
    @author <%= pkg.author %>
    @site <%= pkg.homepage %>
`;

/**
 * GULP ACTIONS
 * Todas as funções que são chamadas diretamente pelo Gulp são actions e devem ser colocadas abaixo dessa marcação.
 */
function updateVersionThemeConfig() {
    const anchor = /"[a-z]{5}_[a-z]{7}":\s"\d{1,2}\.\d{1,2}\.\d{1,2}"/g;
    return gulp
        .src(`${paths.theme.config}/settings.json`)
        .pipe(replace(anchor, `"theme_version": "${version}"`))
        .pipe(gulp.dest(paths.theme.config));
}

function updateVersionThemePanel() {
    const anchor = /\d{1,2}\.\d{1,2}\.\d{1,2}<\/span>/g;
    return gulp
        .src(`${paths.theme.config}/settings.html`)
        .pipe(replace(anchor, `${version}</span>`))
        .pipe(gulp.dest(paths.theme.config));
}

function updateVersionThemeReadme() {
    const anchor = /<b>\d{1,2}\.\d{1,2}\.\d{1,2}/g;
    return gulp
        .src(`./readme.md`)
        .pipe(replace(anchor, `<b>${version}`))
        .pipe(gulp.dest('./'));
}

/**
 * Compile sass files into css and autoprefixer
 * @returns {*}
 */
function processSass() {
    return gulp
        .src(`${paths.theme.sass}/**/*.scss`)
        .pipe(
            sass({
                outputStyle: 'expanded',
                includePaths: ['node_modules'],
            }).on('error', sass.logError)
        )
        .pipe(postcss([autoprefixer]))
        .pipe(gulp.dest(paths.theme.css));
}

/**
 * Generate minified css files
 * @returns {*}
 */
function minifyCSS() {
    return gulp
        .src([`${paths.theme.css}/*.css`, `!${paths.theme.css}/*.min.css`], { sourcemaps: true })
        .pipe(postcss([cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(headerComment(commentTemplate))
        .pipe(gulp.dest(paths.theme.css));
}

/**
 * Concat basic js libs into single file.
 * Load libs from node_modules.
 * @returns {*}
 */
function concatLibsJs() {
    return gulp
        .src([
            'node_modules/vanilla-lazyload/dist/lazyload.min.js',
            'node_modules/swiper/swiper-bundle.min.js',
            'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
            'node_modules/jquery-validation/dist/jquery.validate.min.js',
        ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(paths.theme.js));
}

/**
 * Generate minified js files
 * @returns {*}
 */
function minifyJS() {
    return gulp
        .src([`${paths.theme.js}/**/*.js`, `!${paths.theme.js}/**/*.min.js`], { sourcemaps: true })
        .pipe(terser({ mangle: { toplevel: true } }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(headerComment(commentTemplate))
        .pipe(gulp.dest(paths.theme.js));
}

/**
 * Watch any changes
 */
function watchFiles(cb) {
    watch(`${paths.theme.sass}/**/*.scss`, series(processSass, minifyCSS));
    watch(`${paths.theme.js}/**/!(*.min.js)`, minifyJS);
    return cb();
}

/**
 * GULP TASKS
 * Tarefas que poderão ser executadas pelo gulp.
 */
const build = gulp.series(
    parallel(
        updateVersionThemeConfig,
        updateVersionThemePanel,
        updateVersionThemeReadme,
        series(processSass, minifyCSS),
        series(concatLibsJs, minifyJS)
    )
);

const start = gulp.series(parallel(series(processSass, minifyCSS), series(concatLibsJs, minifyJS)), watchFiles);

exports.build = build;
exports.default = start;
