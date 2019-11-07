export const Config = {
    imgPath: process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/',
    defShare: {
        title: '分享标题',
        desc: '分享描述',
        link: location.href,
        // 分享配图
        img: this.imgPath + 'share.jpg',
        // 项目名，数据查询时候用
        proj: 'streetgame',
        // 填写公众号绑定的appid
        appid: 'wx12380ea254191f1b',
        cnzz: '1259179479'
    }
};

export function formatImgList (Imglist, path) {
    var list = [];
    for (var i = 0; i < Imglist.length; i++) {
        let name = Imglist[i].slice(2);
        list.push({
            name: name,
            url: require('../../img/' + (path || '') + name)
        });
    }
    return list;
};

export function formatJsonList (path, name, number) {
    let loadImgPool = [];
    let loadDataPool = [];
    for (let index = 0; index < number; index++) {
        let json = require('../../img/' + path + name + index + '.json');
        let img = require('../../img/' + path + json.meta.image);
        loadImgPool.push(img);
        loadDataPool.push({
            'data': json,
            'img': img
        });
    }
    return {
        imgPool: loadImgPool,
        dataPool: loadDataPool
    };
};
