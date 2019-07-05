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
