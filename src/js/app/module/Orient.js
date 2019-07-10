// 判断横竖屏
// 参考： https://aotu.io/notes/2017/01/31/detect-orientation/index.html

function detectOrient () {
    var cw = document.documentElement.clientWidth;
    var sw = window.screen.width;
    var sh = window.screen.height;

    [sw, sh] = sw < sh ? [sw, sh] : [sh, sw]; // Android下出现 srceen.width/height 值交换，所以进行大小值比较判断

    console.log(screen.width, screen.height);
    console.log(cw, sw, sh);

    var detectData = document.querySelector('.m-wrap');
    detectData.innerHTML = 'clientWidth；' + document.documentElement.clientWidth + ';<br>' +
        'clientHeight；' + document.documentElement.clientHeight + ';<br>' +
        'sw：' + sw + ';<br>' +
        'sh: ' + sh + ';<br>' +
        'screen.width：' + window.screen.width + ';<br>' +
        'screen.height：' + window.screen.height + ';';

    if (cw === sw) {
        // 竖屏
        console.log('竖屏');
        document.querySelector('html').setAttribute('data-orient', 'portrait');
    } else {
        console.log('横屏');
        document.querySelector('html').setAttribute('data-orient', 'landscape');
    };
}

window.onresize = detectOrient;
window.onload = detectOrient;
