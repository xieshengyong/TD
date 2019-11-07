(function (doc, win) {
    var width = 750;
    var height = 1600;
    var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样

    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var reCalc = function () {
        var docEl = doc.documentElement;
        var winWidth = docEl.clientWidth;
        var winHeight = docEl.clientHeight;
        if (!winWidth) return;
        var scale;
        if (winWidth < winHeight) {
            if ((winWidth / winHeight) > (height / width)) {
                scale = (winHeight / height);
            } else {
                scale = (winWidth / width);
            }
        } else {
            if ((winWidth / winHeight) > (height / width)) {
                scale = (winWidth / height);
            } else {
                scale = (winHeight / width);
            }
        }
        var resultValue = (scale * rootValue).toFixed(2);
        docEl.style.fontSize = (resultValue > 110 ? 110 : resultValue) + 'px';

        // 老年模式，兼容微信右上字体调节, 不支持动态调节；
        var htmlFontSize = parseFloat(window.getComputedStyle(html).fontSize).toFixed(2);
        if (htmlFontSize !== resultValue) {
            html.style.fontSize = (resultValue / (htmlFontSize / resultValue)).toFixed(2) + 'px';
        }
    };
    reCalc();
    setTimeout(function () {
        reCalc();
    }, 300);
    win.addEventListener('load', reCalc, false);
    win.addEventListener(rszEvt, reCalc, false);
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document, window);
