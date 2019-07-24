import TD from './module/TD.js'; // eslint-disable-line
import Config from './Config.js'; // eslint-disable-line

// 项目初始化的一些函数
var initProject = function () {
    // cnzz统计代码 强制HTTPS，防劫持
    // (function () {
    //     var cnzzID = Config.defShare.cnzz;
    //     document.write(unescape('%3Cspan id="cnzz_stat_icon_' + cnzzID + '"%3E%3C/span%3E%3Cscript src="' + 'https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));
    //     $('#cnzz_stat_icon_' + cnzzID).hide();
    // })();

    // 初始化微信接口
    // TD.initWxApi(Config.defShare);

    // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {passive: false});

    /** 解决微信软键盘收回时页面不回弹 */
    let inputEl = document.querySelector('input');
    inputEl && inputEl.addEventListener('blur', () => {
        window.scrollTo(0, 0);
    });

    // debug工具
    if (TD.util.getQuery('vconsole')) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
        script.onload = () => {
            var vConsole = new VConsole(); // eslint-disable-line
            console.log('Hello world');
        };
        script.src = require('../lib/vconsole.min.js');
    }
};

// 加载页对象
var LoadViewController = function () {
    initProject();

    this.show = () => {
    };
};

module.exports = LoadViewController;
