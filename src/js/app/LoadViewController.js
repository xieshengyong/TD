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

    async load () {
        if (this.isLoaded) return;

        let loader = new Loader();
        loader
            .add(formatImgList(require.context('../../img/', false).keys()), '')
            // .add(formatImgList(require.context('../../img/2/', false).keys()), '')
            .load();

        loader.onProgress.add((param) => {
            let prs = Math.ceil(param.progress);
            // loadProgress.html(prs + '%');
            // console.log(prs);
        });

        loader.onComplete.add(() => {
            this.isLoaded = true;

            // this.onLoad && this.onLoad();
        });

        // this.init();
    },

    // 图形剪切
    clipSignleGraphics (data, percent, reverse) {
        let end = !reverse ? [] : ['0% ', '0%', ', ', '0% ', '100%', ', '];
        let bodySize = data.body.size;
        let shapes = data.shapes;

        let clacPos = (x, y) => {
            return [(x / bodySize[0] * 100).toFixed(2) + '%', ' ', (y / bodySize[1] * 100).toFixed(2) + '%'];
        };

        shapes.forEach(ele1 => {
            if (ele1.type !== 'poly') return;
            let polys = ele1.polys;

            reverse && (end = end.concat(clacPos(polys[0][0], 0)[0], ' 100%', ', '));

            polys.forEach(ele2 => {
                // 多个被剖分的三角形时，闭合各自三角的起点
                (polys.length > 1 || shapes.length > 1 || reverse) && (ele2 = ele2.concat(ele2[0], ele2[1]));

                // 多个独立形状时，每个形状结束时回到第一个形状起点
                shapes.length > 1 && (ele2 = ele2.concat(shapes[0]['polys'][0][0], shapes[0]['polys'][0][1]));

                for (let index = 0; index < ele2.length; index += 2) {
                    end = end.concat(clacPos(ele2[index], ele2[index + 1]), ', ');
                }
            });

            reverse && (end = end.concat(clacPos(polys[0][0], 0)[0], ' 100%', ', '));
        });

        reverse && (end = end.concat(['100% ', '100%', ', ', '100% ', '0%', ', ']));

        end.pop();
        return end.join('');
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
        // http://species-in-pieces.com/#

        // let a = require('./cs2.json');
        // let aaa = this.clip2Signle(a['a']);
        // let aaa = this.hollow(a['a']);
        // let aaa = this.hollow(a['t2']);
        // console.log('end :', aaa);
        // $('.m-loading').css('clip-path', 'polygon(' + aaa + ')');
        // this.clip2Mulit(require('./c.json')['c'], $('.m-loading')[0]);
        // this.clip2Mulit(require('./c.json')['b'], $('.m-loading')[0]);

        // console.log(this.clipSignleGraphics(require('./cs2.json')['a'], true));
        // $('.m-end').css('clip-path', 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true) + ')');
        // $('.m-end').css('clip-path', 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, true) + ')');

        for (let index = 0; index < 33; index++) {
            let div = $('<div class="idx-' + index + '"></div>');
            div.css('background-color', getRandomColor());
            $('.m-loading').append(div);
        }

        const showAnimal = (data, name) => {
            let divall = $('.m-loading div');
            for (let index = 32; index >= 0; index--) {
                setTimeout(() => {
                    let div = divall.eq(index);
                    div.css('clip-path', 'polygon(' + this.clipSignleGraphics(data[name + pad(index, 5)]) + ')');
                }, index * 20);
            }
        };

        let ani1 = require('./ani1.json');
        let ani2 = require('./ani2.json');
        let ani3 = require('./ani3.json');
        showAnimal(ani1, 'ani_');
        let aniPool = [
            [ani1, 'ani_'],
            [ani2, 'ani2_'],
            [ani3, 'ani3_']
        ];

        let i = 0;
        $('body').click(() => {
            i = i > 1 ? 0 : i + 1;
            showAnimal(aniPool[i][0], aniPool[i][1]);
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

function getImageColor (canvas, img, opacity = 255) {
    canvas.width = img.width;
    canvas.height = img.height;

    var context = canvas.getContext('2d');

    context.drawImage(img, 0, 0);

    // 获取像素数据
    var data = context.getImageData(0, 0, img.width, img.height).data;
    // eslint-disable-next-line one-var
    let r = 0, g = 0, b = 0;
    let allNum = 0;

    // 取所有像素的平均值
    for (var row = 0; row < img.height; row++) {
        for (var col = 0; col < img.width; col++) {
            if (data[((img.width * row) + col) * 4 + 3] >= opacity) {
                allNum++;
                r += data[((img.width * row) + col) * 4];
                g += data[((img.width * row) + col) * 4 + 1];
                b += data[((img.width * row) + col) * 4 + 2];
            }
        }
    }

    // 求取平均值
    r /= allNum;
    g /= allNum;
    b /= allNum;

    // 将最终的值取整
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);

    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
