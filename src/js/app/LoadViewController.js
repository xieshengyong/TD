/* eslint-disable no-unused-vars */
import TD from './module/TD.js';
import {
    Config,
    formatImgList
} from './Config.js';
import { Loader } from 'resource-loader';

// 加载页对象
export const LoadViewController = {
    show () {
        this.load();
    },

    load () {
        if (this.isLoaded) return;

        let loader = new Loader();
        loader
            .add(formatImgList(require.context('../../img/', false).keys()), '')
            .load();

        loader.onProgress.add((param) => {
            let prs = Math.ceil(param.progress);
            // loadProgress.html(prs + '%');
            console.log(prs);
        });

        loader.onComplete.add(() => {
            this.isLoaded = true;

            this.onLoad && this.onLoad();
        });

        this.init();
    },

    clip (data) {
        let first = data[0]['shape'][0];
        let second = data[0]['shape'][1];
        let end = '';
        data.forEach(ele1 => {
            let arr = ele1.shape;
            let st = '';

            arr.push(arr[0]);
            arr.push(arr[1]);

            arr.unshift(second);
            arr.unshift(first);

            arr.forEach((ele2, idx) => {
                let fix = (idx % 2) > 0 ? 'rem, ' : 'rem ';
                st += ((ele2 / 100) + fix);
            });

            end += st;
        });
        let aaa = end.substr(0, end.length - 2);

        return aaa;
    },

    hollow (data) {
        let end = '0% 0%, 0% 100%, ';
        data.forEach(ele1 => {
            let arr = ele1.shape;
            let st = arr[0] / 100 + 'rem 100%, ';

            arr.push(arr[0]);
            arr.push(arr[1]);

            arr.forEach((ele2, idx) => {
                let fix = (idx % 2) > 0 ? 'rem, ' : 'rem ';
                st += ((ele2 / 100) + fix);
            });

            st += (arr[0] / 100) + 'rem 100%,';
            end += st;
        });
        let aaa = end + '100% 100%, 100% 0%';

        return aaa;
    },

    init () {
        let a = require('./cs2.json');
        // let aaa = this.clip(a['a']);
        // let aaa = this.hollow(a['a']);
        let aaa = this.hollow(a['t2']);
        console.log('end :', aaa);
        $('.m-loading').css('clip-path', 'polygon(' + aaa + ')');
    }
};

// 项目初始化的一些函数
(function initProject () {
    /* cnzz统计代码 强制HTTPS，防劫持 */
    // var cnzzID = Config.defShare.cnzz;
    // document.write(unescape('%3Cspan id="cnzz_stat_icon_' + cnzzID + '"%3E%3C/span%3E%3Cscript src="https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));
    // document.querySelector('#cnzz_stat_icon_' + cnzzID).style.display = 'none';

    // 初始化微信接口
    // TD.initWxApi(Config.defShare);

    // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
    document.body.addEventListener('touchmove', e => e.preventDefault(), {passive: false});

    /** 解决微信软键盘收回时页面不回弹 */
    var resetScroll = (function () {
        let timeWindow = 500;
        let timeout; // time in ms
        var functionName = function (args) {
            let inputEl = document.querySelectorAll('input, select, textarea, option');
            inputEl && inputEl.forEach(ele => {
                ele.addEventListener('blur', () => {
                    window.scrollTo(0, 0);
                });
            });
        };

        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                functionName.apply(context, args);
            }, timeWindow);
        };
    }());
    $('body').on('DOMSubtreeModified', resetScroll);

    // debug工具
    if (TD.util.getQuery('vconsole')) {
        let script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = () => {
            new VConsole(); // eslint-disable-line
            console.log('Hello world');
        };
        script.src = require('../lib/vconsole.min.js');
    }
}());
