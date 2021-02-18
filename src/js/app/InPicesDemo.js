/* eslint-disable no-unused-vars */
import TD, { pad } from './module/TD.js';
import {
    Config,
    formatImgList
} from './Config.js';
import { Loader } from 'resource-loader';

// 加载页对象
export const InPicesDemo = {
    show () {
        $('.m-demo1').fadeIn(100);
        // this.getAllImgColor();
        this.init();
    },

    hide () {
        $('.m-demo1').fadeOut(100).html('');
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

    init () {
        this.colorPool1 = ['rgb(187,89,1)', 'rgb(228,135,27)', 'rgb(128,45,11)', 'rgb(128,45,11)', 'rgb(32,26,20)', 'rgb(48,31,24)', 'rgb(186,147,118)', 'rgb(131,92,63)', 'rgb(164,121,92)', 'rgb(159,62,9)', 'rgb(60,32,25)', 'rgb(91,33,21)', 'rgb(187,89,1)', 'rgb(129,51,0)', 'rgb(75,31,23)', 'rgb(158,63,0)', 'rgb(106,36,11)', 'rgb(59,39,25)', 'rgb(48,31,24)', 'rgb(246,190,64)', 'rgb(236,174,51)', 'rgb(222,145,0)', 'rgb(218,123,0)', 'rgb(201,105,10)', 'rgb(174,85,11)', 'rgb(213,148,30)', 'rgb(189,112,0)', 'rgb(183,93,11)', 'rgb(95,56,44)', 'rgb(107,70,62)', 'rgb(85,43,5)', 'rgb(78,48,29)', 'rgb(60,39,25)'];
        this.colorPool2 = ['rgb(57,112,74)', 'rgb(75,160,114)', 'rgb(28,50,71)', 'rgb(246,228,124)', 'rgb(229,187,11)', 'rgb(242,201,32)', 'rgb(255,249,132)', 'rgb(244,230,92)', 'rgb(254,211,58)', 'rgb(255,223,50)', 'rgb(184,154,1)', 'rgb(254,211,58)', 'rgb(240,235,108)', 'rgb(250,226,54)', 'rgb(255,215,33)', 'rgb(251,202,16)', 'rgb(252,218,43)', 'rgb(240,236,109)', 'rgb(112,84,0)', 'rgb(217,198,26)', 'rgb(190,162,13)', 'rgb(255,238,86)', 'rgb(244,206,27)', 'rgb(250,221,15)', 'rgb(251,199,0)', 'rgb(153,111,5)', 'rgb(254,220,69)', 'rgb(42,36,36)', 'rgb(58,57,59)', 'rgb(22,10,17)', 'rgb(43,39,35)', 'rgb(251,251,251)', 'rgb(231,192,0)'];
        // http://species-in-pieces.com/#

        for (let index = 0; index < 33; index++) {
            let div = $('<div class="idx-' + index + '"></div>');
            $('.m-demo1').append(div);
        }

        const showAnimal = (data) => {
            let divall = $('.m-demo1 div');
            $('.m-demo1').css('background-color', data[3]);
            for (let index = 32; index >= 0; index--) {
                setTimeout(() => {
                    let div = divall.eq(index);
                    div.css('clip-path', 'polygon(' + this.clipSignleGraphics(data[0][data[1] + pad(index, 5)]) + ')');
                    div.css('background-color', data[2][index]);
                }, index * 20);
            }
        };

        let ani1 = require('./ani1.json');
        let ani2 = require('./ani2.json');
        let ani3 = require('./ani3.json');
        let aniPool = [
            [ani1, 'ani_', this.colorPool1, '#f7aed5'],
            [ani2, 'ani2_', this.colorPool2, '#775fbd']
            // [ani3, 'ani3_']
        ];
        showAnimal(aniPool[0]);

        let i = 0;
        $('.m-demo1').click(() => {
            i = i > 0 ? 0 : i + 1;
            showAnimal(aniPool[i]);
        });
    },

    // 获取所有图片的颜色
    async getAllImgColor () {
        let list = formatImgList(require.context('../../img/2/', false).keys());
        let colorPool = [];
        async function getSignleImgColor () {
            let img = await TD.imgLoader(list.shift().url);
            let [canvas, ctx] = TD.getCanvas(img.width, img.height);
            colorPool.push(getImageColor(canvas, img));
            list.length ? getSignleImgColor() : console.log(colorPool);
        }
        getSignleImgColor();
    }
};

var getRandomColor = function () {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
};

// 取图片平均颜色
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
