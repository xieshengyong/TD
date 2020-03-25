/*
 * @Author: xieshengyong
 * @Date: 2019-06-18 11:35:03
 * @Last Modified by: xieshengyong
 * @Last Modified time: 2020-03-25 16:36:22
 */
/* eslint-disable no-unused-vars */
const {
    series,
    parallel,
    src,
    dest,
    watch,
    done
} = require('gulp');

// var browsersync = require('browser-sync').create();
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var del = require('del');
// var fileInline = require('gulp-file-inline');
// var minimist = require('minimist');
// var convertEncoding = require('gulp-convert-encoding');
// var gulpLess = require('gulp-less');
// var path = require('path');
// var md5 = require('gulp-md5-plus');
var vinylPaths = require('vinyl-paths');
var audiosprite = require('gulp-audiosprite');
// var changed = require('gulp-changed');
// var gulpIf = require('gulp-if');
// var deleteEmpty = require('delete-empty');

var config = require('./config.path');

// var options = minimist(process.argv.slice(2));
// var Dir = config[options.d || 'dist'];

let outputDir = './a20190826anniversary/';

let audioExport = './src/media/';
const audio = series(() => {
    return src('./src/media/effect/*.*')
        .pipe(audiosprite({
            output: 'spriteBgm',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96'
        }))
        .pipe(dest(audioExport));
}, function () {
    return src(audioExport + 'spriteBgm.json')
        .pipe(vinylPaths(del))
        .pipe(rename('spriteBgm.js'))
        .pipe(replace(/^{/g, 'var spriteBgm = {'))
        .pipe(replace(/}$/g, '};\nmodule.exports = spriteBgm;\n'))
        .pipe(dest('./src/js/app/'));
});
exports.audio = audio;

const audio2 = series(() => {
    return src('./BgmSprite/bgm/*.*')
        .pipe(audiosprite({
            output: 'bgm',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96'
        }))
        .pipe(dest(audioExport));
}, function () {
    return src(audioExport + 'bgm.json')
        .pipe(vinylPaths(del))
        .pipe(rename('bgm.js'))
        .pipe(replace(/^{/g, 'var bgm = {'))
        .pipe(replace(/}$/g, '};\nmodule.exports = bgm;\n'))
        .pipe(dest('./assets/script/'));
});
exports.audio2 = audio2;

const audioZip = () => {
    return src('./BgmSprite/*.*')
        .pipe(audiosprite({
            output: 'spriteBgm11',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96'
        }))
        .pipe(dest(audioExport));
};
exports.audioZip = audioZip;

// 清理文件夹
var clean = function () {
    return del([outputDir + '**/*.*']);
};
exports.clean = clean;

// 复制资源
var copy = series(clean, series(function () {
    return src('./dist/**/*.*')
            .pipe(dest(outputDir));
}, function () {
    return src([
        './build/web-mobile/**',
        '!./build/web-mobile/style-desktop**.css',
        '!./build/web-mobile/style-mobile**.css',
        '!./build/web-mobile/main**.js',
        '!./build/web-mobile/splash**.png',
        '!./build/web-mobile/index.html'
    ], {
        base: './build/web-mobile/'
    })
        .pipe(dest(outputDir + 'ossweb-img'));
}));
exports.copy = copy;

// 替换html内路径
var replaceHtml = function () {
    return src('dist/index.html')
        .pipe(replace(/\.\//g, Dir))
        .pipe(dest(outputDir));
};
exports.replaceHtml = replaceHtml;

const copyjscss = series(
    function () {
        return src(outputDir + 'index.html')
            .pipe(replace(Dir, './js/'))
            .pipe(dest(outputDir));
    },
    function () {
        return src(outputDir + 'index.html')
            .pipe(replace('./js/main.css', './css/main.css'))
            .pipe(dest(outputDir));
    },
    function () {
        return src(outputDir + 'ossweb-img/' + 'game**.js')
            .pipe(vinylPaths(del))
            .pipe(replace(Dir + 'src/', './js/'))
            .pipe(dest(outputDir + 'js/'));
    },
    function () {
        return src([
            outputDir + 'ossweb-img/' + 'cocos2d-js-min**.js',
            outputDir + 'ossweb-img/' + 'main**.js',
            outputDir + 'ossweb-img/' + 'src/project**.js',
            outputDir + 'ossweb-img/' + 'src/settings**.js'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'js/'));
    }, function () {
        return src([
            outputDir + 'ossweb-img/' + 'src/assets/script/utils/howler.min**.js'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'js/assets/script/utils/'));
    }, function () {
        return src([
            outputDir + 'ossweb-img/' + 'main**.css'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'css/'));
    });
exports.copyjscss = copyjscss;

// 替换game.js内路径
var replaceMain = function () {
    return src('change/game.js')
        .pipe(replace(/res\//g, Dir + 'res/'))
        .pipe(replace(/'src\//g, "'" + Dir + 'src/'))
        .pipe(dest(outputDir + 'ossweb-img/'));
};
exports.replaceMain = replaceMain;

const isMd5 = (file) => {
    if (options.md5) {
        return md5(5, file);
    } else {
        return replace();
    }
};

// md5
var mdbuild = series(function () {
    return src(outputDir + 'ossweb-img/src/project.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('project.js'))
            .pipe(isMd5(outputDir + 'ossweb-img/game.js'))
            .pipe(dest(outputDir + 'ossweb-img/src'))
            ;
}, function () {
    return src(outputDir + 'ossweb-img/cocos2d-js-min.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('cocos2d-js-min.js'))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img'));
}, function () {
    return src(outputDir + 'ossweb-img/src/settings.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('settings.js'))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img/src'));
}, function () {
    return src(outputDir + 'ossweb-img/game.js')
            .pipe(vinylPaths(del))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img'));
});
exports.mdbuild = mdbuild;

const gbk = () => {
    return src([outputDir + '**/*.html', outputDir + '**/*.json', outputDir + '**/*.js'])
        .pipe(replace(/utf-8/g, 'gbk'))
        .pipe(convertEncoding({
            from: 'utf8',
            to: 'gbk'
        }))
        .pipe(dest(outputDir + ''));
    // if (options.gbk) {
    // }
};
exports.gbk = gbk;

// browsersync自动刷新
var browserSync = function () {
    browsersync.init({
        open: 'external',
        server: {
            baseDir: './change/'
            // baseDir: "a20181213act_mobile"
        },
        // port: 80,
        files: ['change/*.css', 'change/*.css', 'change/*.js', 'change/*.html']
    });
};
exports.sync = browserSync;

var browserSync2 = function () {
    browsersync.init({
        open: 'external',
        server: {
            baseDir: outputDir
        }
        // files: ['a20181213act_mobile/*.html']
    });
};
exports.sync2 = browserSync2;

// 对比
var marked = series(() => {
    return del(['aHasChangedFiles']);
}, () => {
    return src(['a20190826anniversary/**'], {
        base: outputDir
    })
    .pipe(gulpIf(f => !f.isDirectory(), changed('aLastBuild', {hasChanged: changed.compareContents})))
    .pipe(dest('aHasChangedFiles'));
}, () => {
    return del('aLastBuild');
}, () => {
    return src('a20190826anniversary/**', {
        base: outputDir
    })
    .pipe(dest('aLastBuild'));
}, () => {
    return new Promise((resolve, reject) => {
        deleteEmpty('aHasChangedFiles').then(resolve);
    });
});
exports.marked = marked;

// exports.build = series(copy, replaceHtml, replaceMain, mdbuild, gbk);
exports.build = series(copy, replaceHtml, replaceMain, mdbuild);
