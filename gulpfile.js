const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

// Compila SCSS e minifica CSS
function styles() {
    return src("./src/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./dist/css"));
}

// Minifica JS
function scripts() {
    return src("./src/js/*.js")
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./dist/js"));
}

// Observa a mudança nos arquivos
function watcher() {
    watch("./src/sass/*.scss", styles);
    watch("./src/js/*.js", scripts);
}

// Tarefa padrão
exports.default = series(
    parallel(styles, scripts),
    watcher
);

// Tarefas separadas
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watcher;