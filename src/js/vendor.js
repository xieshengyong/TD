/**
 *
 * 第三方库及不需要频繁改动的资源引用放在此文件
 *
 * 可以缓存包体，加快打包构建速度
 *
 */

/**
 * zepto 按需引入，以下是推荐引入的部分
 */
import 'zepto/src/zepto';
import 'zepto/src/event';
// import 'zepto/src/ajax';
import 'zepto/src/fx';
import 'zepto/src/fx_methods';

/**
 * howler 音频库
 */
// import 'howler';

/**
 * PIXI
 */
// import * as PIXI from 'pixi.js'; // eslint-disable-line
/*
    Parse or format dates

    fecha.format(<Date Object>, <String Format>);

    // Custom formats
    fecha.format(new Date(2015, 10, 20), 'dddd MMMM Do, YYYY'); // 'Friday November 20th, 2015'
    fecha.format(new Date(1998, 5, 3, 15, 23, 10, 350), 'YYYY-MM-DD hh:mm:ss.SSS A'); // '1998-06-03 03:23:10.350 PM'

    // Named masks
    fecha.format(new Date(2015, 10, 20), 'mediumDate'); // 'Nov 20, 2015'
    fecha.format(new Date(2015, 2, 10, 5, 30, 20), 'shortTime'); // '05:30'

    // Literals
    fecha.format(new Date(2001, 2, 5, 6, 7, 2, 5), '[on] MM-DD-YYYY [at] HH:mm'); // 'on 03-05-2001 at 06:07'
*/
// import fecha from 'fecha';

// window.PIXI = PIXI;
// window.fecha = fecha;
