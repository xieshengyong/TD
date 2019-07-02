/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import 'zepto/src/zepto';
import 'zepto/src/event';
import 'zepto/src/fx';
import 'zepto/src/fx_methods';

import 'howler';
import * as PIXI from 'pixi.js'

// 引入的包根据实际情况而定
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

// 页面级对象池
var pagePool = {
    loadView: null,
    indexView: null
};

var init = function () {
    // load页面
    var loadPageBack = function () {
        pagePool.loadView = pagePool.loadView || new LoadViewController();

        var loadView = pagePool.loadView;
        loadView.show();
        loadView.onhide = indexPageBack;

        loadView.load();

        const qqq = (params) => {
            console.log(7);
        }
        qqq();
    };

    // index页面
    var indexPageBack = function () {
        pagePool.indexView = pagePool.indexView || new IndexViewController();

        var indexView = pagePool.indexView;
        indexView.show();
        // indexView.onhide = gamePageBack;
    };

    loadPageBack();
};

init();
