// 判断横竖屏
// 参考： https://aotu.io/notes/2017/01/31/detect-orientation/index.html

(function (doc, win) {
    function detectOrient () {
        var cw = document.documentElement.clientWidth;
        var sw = window.screen.width;
        var sh = window.screen.height;

        [sw, sh] = sw < sh ? [sw, sh] : [sh, sw]; // Android下出现 srceen.width/height 值交换，所以进行大小值比较判断

        if (cw === sw) {
            // 竖屏
            document.querySelector('html').setAttribute('data-orient', 'portrait');
        } else {
            document.querySelector('html').setAttribute('data-orient', 'landscape');
        };
    };
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    win.addEventListener('load', detectOrient, false);
    win.addEventListener(rszEvt, detectOrient, false);
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', detectOrient, false);
})(document, window);
