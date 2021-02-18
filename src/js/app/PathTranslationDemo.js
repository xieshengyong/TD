/* eslint-disable no-unused-vars */
import TD, { pad } from './module/TD.js';
import {
    Config,
    formatImgList
} from './Config.js';
import { Loader } from 'resource-loader';

// 加载页对象
export const PathTranslationDemo = {
    show () {
        // $('.m-demo2').fadeIn(100);
        // this.init();

        // let inline = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['a'], !true, 'in') + ')';
        // let outline = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['a_b'], !true) + ')';
        // $('.m-demo3 .bg').css('clip-path', outline);
        // $('.m-demo3').click(() => {
        //     $('.m-demo3 .bg').css('clip-path', inline);
        // });

        let font1 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['font1'], !true) + ')';
        let font2 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['font2'], !true) + ')';
        let animPool = [font1, font2];
        $('.m-demo4 .bg').css('clip-path', animPool[1]);
        $('.m-demo4').click(() => {
            $('.m-demo4 .bg').css('clip-path', animPool[0]);
            animPool.unshift(animPool.pop());
        });
    },

    hide () {
        $('.m-demo2').fadeOut(100);
    },

    init () {
        // http://species-in-pieces.com/#
        let outline = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t3'], true, ['outline']) + ')';
        let outline1 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t3'], true, ['outline-1', 'outline-2']) + ')';
        let arrow1 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['Arrow1']) + ')';
        let arrow2 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['Arrow2']) + ')';
        let cicle1 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['cicle1']) + ')';
        let arrow34 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['Arrow3', 'Arrow4']) + ')';
        let cicle12 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['cicle2', 'cicle1-1']) + ')';
        let cicle34 = 'polygon(' + this.clipSignleGraphics(require('./cs2.json')['t2'], true, ['cicle4', 'cicle3']) + ')';

        let trsPool = [
            outline,
            arrow1,
            arrow2,
            cicle1,
            outline,
            outline1,
            arrow34,
            cicle12,
            cicle34,
            outline1
        ];

        $('.m-demo2 .clip-content').css('clip-path', outline);
        let idx = 1;
        $('.m-demo2').click(() => {
            idx === 1 && setTimeout(() => {
                $('.tips-content').fadeIn(200);
            }, 700);
            $('.m-demo2 .clip-content').css('clip-path', trsPool[idx]);
            idx = (idx === trsPool.length - 1) ? 0 : idx + 1;
            idx === trsPool.length - 1 && $('.tips-content').fadeOut(200);
        });
    },

    async load () {
        if (this.isLoaded) return;

        let loader = new Loader();
        loader
            // .add(formatImgList(require.context('../../img/', false).keys()), '')
            .add(formatImgList(require.context('../../img/2/', false).keys()), '')
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

        this.init();
    },

    // 图形剪切
    clipSignleGraphics (data, reverse, name) {
        let end = !reverse ? [] : ['0% ', '0%', ', ', '0% ', '100%', ', '];
        let bodySize = data.body.size;
        let shapes = data.shapes;

        let clacPos = (x, y) => {
            return [(x / bodySize[0] * 100).toFixed(2) + '%', ' ', (y / bodySize[1] * 100).toFixed(2) + '%'];
        };

        shapes.forEach(ele1 => {
            if (ele1.type !== 'poly' || (name && name.indexOf(ele1.name) <= -1)) return;
            let polys = ele1.polys;
            console.log(polys[0].length);

            reverse && (end = end.concat(clacPos(polys[0][0], 0)[0], ' 100%', ', '));

            polys.forEach(ele2 => {
                // 多个被剖分的三角形时，闭合各自三角的起点
                // (polys.length > 1 || shapes.length > 1 || reverse) && (ele2 = ele2.concat(ele2[0], ele2[1]));
                (reverse) && (ele2 = ele2.concat(ele2[0], ele2[1]));

                // 多个独立形状时，每个形状结束时回到第一个形状起点
                // shapes.length > 1 && (ele2 = ele2.concat(shapes[0]['polys'][0][0], shapes[0]['polys'][0][1]));

                let temp = [];
                for (let index = 0; index < ele2.length; index += 2) {
                    temp.push([ele2[index], ele2[index + 1]]);
                    end = end.concat(clacPos(ele2[index], ele2[index + 1]), ', ');
                }

                // temp.sort((a, b) => {
                //     return b[0] - a[0];
                // });

                // temp.forEach(element => {
                //     end = end.concat(clacPos(element[0], element[1]), ', ');
                // });
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

    // 中空
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
    }
};

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
