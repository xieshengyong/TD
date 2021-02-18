/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/style.less';

// 引入的包根据实际情况而定
// import { LoadViewController } from './app/LoadViewController';
import { InPicesDemo } from './app/InPicesDemo';
import { PathTranslationDemo } from './app/PathTranslationDemo';
// import {IndexViewController} from './app/IndexViewController';

// var Router = {
//     // load页面
//     loadPageBack () {
//         LoadViewController.show();

//         LoadViewController.onHide = () => this.choosePageBack();
//     },

//     // index页面
//     indexPageBack () {
//         IndexViewController.show();
//     }
// };

// Router.loadPageBack();

// InPicesDemo.show();
PathTranslationDemo.show();
$('.demo1').click(() => {
    InPicesDemo.show();
    PathTranslationDemo.hide();
});

$('.demo2').click(() => {
    InPicesDemo.hide();
    PathTranslationDemo.show();
});
