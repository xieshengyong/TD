/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/style.less';

/** The animate() method */
import './util/fx';
/** Animated show, hide, toggle, and fade*() methods. */
import './util/fx_methods';

import 'howler/src/howler.core';

// 引入的包根据实际情况而定
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

var init = function () {
    // load页面
    const loadPageBack = () => {
        let loadView = new LoadViewController();

        loadView.onHide = indexPageBack;

        loadView.load();
    };

    const indexPageBack = () => {
        let indexView = new IndexViewController();

        indexView.show();
        indexView.onHide = indexPageBack;
    };

    loadPageBack();
};

new init(); // eslint-disable-line
