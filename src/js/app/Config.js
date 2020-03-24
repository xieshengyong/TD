var Config = {};

// ajax请求链接
Config.requireUrl = '';

// 图片路径前缀
// 如kf文件里图片不使用require时 img地址：Config.imgPath
Config.imgPath = process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/';

// 默认分享语
Config.defShare = {
    title: '分享标题',
    desc: '分享描述',
    link: location.href,
    // 分享配图
    img: require('../../img/kf/share.jpg'),
    // 项目名，数据查询时候用
    proj: 'streetgame',
    // 填写公众号绑定的appid
    appid: '', // 例如: wx12380ea254191f1b
    cnzz: '' // 例如: 1259179479
};

Config.bgm = new Howl({
    src: require('../../media/test_audio.mp3'),
    loop: true,
    html5: false,
    autoplay: !localStorage.debug
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 打开媒体
        Howler && Howler.mute(false);
    } else {
        // 关闭媒体
        Howler && Howler.mute(true);
    }
});

module.exports = Config;
