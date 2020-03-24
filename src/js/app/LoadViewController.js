import TD from './module/TD.js';
import Config from './Config.js';
import PX from './module/PX';
import * as PIXI from 'pixi.js';

// 项目初始化的一些函数
var initProject = function () {
    // 自动添加cnzz统计代码
    var cnzzID = Config.defShare.cnzz;
    cnzzID && document.write(unescape('%3Cspan style="display: none" id="cnzz_stat_icon_' + cnzzID + '"%3E%3C/span%3E%3Cscript src="' + 'https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));

    // 初始化微信接口
    Config.defShare.appid && TD.initWxApi(Config.defShare);

    // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {passive: false});

    /** 解决ios12微信input软键盘收回时页面不回弹，兼容动态添加dom(腾讯登录组件)的情况 */
    var resetScroll = (function () {
        var timeWindow = 500;
        var timeout; // time in ms
        var functionName = function (args) {
            let inputEl = $('input, select, textarea');
            // TODO: 连续添加元素时，可能存在重复绑定事件的情况
            inputEl && inputEl.on('blur', () => {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight, 0));
            });
        };

        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                functionName.apply();
            }, timeWindow);
        };
    }());
    TD.browser.versions.ios && $('body').on('DOMSubtreeModified', resetScroll);

    // debug工具
    if (TD.util.getQuery('vconsole')) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
        script.onload = () => {
            new VConsole(); // eslint-disable-line
            console.log('Hello world');
        };
        script.src = require('../lib/vconsole.min.js');
    }
};

// 加载页对象
export default class LoadViewController {
    constructor () {
        initProject();

        // 防止IOS序列帧动画抖动
        if (TD.browser.versions.ios) {
            PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
        }

        PX.init();
    }

    load () {
        let progressWrapEl = $('.m-loading .procress-wrap'); // eslint-disable-line
        let progressEl = $('.m-loading .process-line');

        let loader = new PIXI.Loader();
        loader
            .add(this.formatImgList())
            .add(this.formatJsonList())
            .on('progress', (param) => {
                // console.log(param.progress);
                let prs = Math.ceil(param.progress);
                progressEl.html(prs + '%');
            })
            .load(() => {
                // console.log(PX.res);
                progressWrapEl.fadeOut(200);
                this.showIndex();
            });
    }

    showIndex () {
        // Video.initVideo();
        this.beginCtn = PX.addCtn(PX.stage);

        let beginBg = PX.addSprite(this.beginCtn, 'grid.jpg', 0, 0);
        PX.hide(beginBg);
        PX.show(beginBg, 0.3);

        // $('.btn-turn').click((e) => {
        //     if ($(e.target).hasClass('off')) {
        //         Config.bgm.play();
        //         $(e.target).removeClass('off');
        //         Video.videoPlayer.muted = false;
        //     } else {
        //         Config.bgm.pause();
        //         $(e.target).addClass('off');
        //         Video.videoPlayer.muted = true;
        //     }
        // });
    }

    formatJsonList () {
        let context = require.context('../../img/pixi_sprite_sheet/', false, /\.json/);
        let loadDataPool2 = context.keys();
        var list = [];
        for (var i = 0; i < loadDataPool2.length; i++) {
            let name = loadDataPool2[i].slice(2);
            list.push(Config.imgPath + 'pixi_sprite_sheet/' + name);
        }
        return list;
    }

    formatImgList () {
        let context = require.context('../../img/pixi/', true);
        let Imglist = context.keys();
        var list = [];
        for (var i = 0; i < Imglist.length; i++) {
            let name = Imglist[i].slice(2);
            list.push({
                name: name,
                url: require('../../img/pixi/' + name)
            });
        }
        return list;
    };

    hide () {
        this.onHide && this.onHide();
    }
};
