/* eslint-disable no-unused-vars */
import TD, { pad } from './module/TD.js';
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

    clip2Signle (data) {
        let first = data[0]['shape'][0];
        let second = data[0]['shape'][1];
        let end = '';
        data.forEach(ele1 => {
            let arr = ele1.shape;
            let st = '';

            // arr.push(arr[0]);
            // arr.push(arr[1]);

            // arr.unshift(second);
            // arr.unshift(first);

            arr.forEach((ele2, idx) => {
                let fix = (idx % 2) > 0 ? 'rem, ' : 'rem ';
                st += ((ele2 / 100) + fix);
            });

            end += st;
        });
        let aaa = end.substr(0, end.length - 2);

        return aaa;
    },

    clipSignleGraphics () {

    },

    clip2Mulit (data, wrap) {
        data.forEach(ele1 => {
            let arr = ele1.shape;
            let st = '';

            arr.forEach((ele2, idx) => {
                let fix = (idx % 2) > 0 ? 'rem, ' : 'rem ';
                st += ((ele2 / 100) + fix);
            });

            let end = st.substr(0, st.length - 2);
            let div = document.createElement('div');
            div.style.clipPath = 'polygon(' + end + ')';
            div.style.backgroundColor = getRandomColor();
            if (wrap instanceof HTMLElement) {
                wrap.appendChild(div);
            } else {
                console.error('wrap 需是dom元素');
            }
        });
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
        // let a = require('./cs2.json');
        // let aaa = this.clip2Signle(a['a']);
        // let aaa = this.hollow(a['a']);
        // let aaa = this.hollow(a['t2']);
        // console.log('end :', aaa);
        // $('.m-loading').css('clip-path', 'polygon(' + aaa + ')');
        // this.clip2Mulit(require('./c.json')['c'], $('.m-loading')[0]);
        // this.clip2Mulit(require('./c.json')['b'], $('.m-loading')[0]);

        for (let index = 0; index < 33; index++) {
            let div = $('<div class="idx-' + index + '"></div>');
            div.css('background-color', getRandomColor());
            $('.m-loading').append(div);
        }

        const showAnimal = (data, name) => {
            let divall = $('.m-loading div');
            let i = 32;
            while (i > -1) {
                let ii = i;
                setTimeout(() => {
                    let div = divall.eq(ii);
                    div.css('clip-path', 'polygon(' + this.clip2Signle(data[name + pad(ii, 5)]) + ')');
                }, i * 30);
                i--;
            }
        };

        let ani2 = require('./ani2.json');
        let ani3 = require('./ani3.json');
        showAnimal(ani3, 'ani3_');

        let isNext = !false;
        $('body').click(() => {
            isNext ? showAnimal(ani2, 'ani2_') : showAnimal(ani3, 'ani3_');
            isNext = !isNext;
        });
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

var getRandomColor = function () {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
};
