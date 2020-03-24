/**
 *开发tips：
 * 1、 renderer.view.toDataURL('image/png')遇到空图片时，可以先renderer.renderer()一次；
 *
 * 2、 防止IOS序列帧动画抖动， 判读为IOS时PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

const res = PIXI.utils.TextureCache; // eslint-disable-line

export default class PX {
    static init () {
        var app = new PIXI.Application({
            width: 750,
            height: 1600,
            transparent: true,
            backgroundColor: 0x000000
        });
        var stageWrap = document.querySelector('.m-stage') || document.querySelector('body');
        stageWrap.appendChild(app.view);
        app.stage.interactive = true;

        this.res = res;

        this.app = app;
        this.stage = app.stage;

        this.widgetPool = [];

        // 在获取到真正视口区域前不停获取
        const getDOMRect = () => {
            this.DOMRect = app.view.getBoundingClientRect();
            this.domStageRatio = this.app.screen.width / this.DOMRect.width;
            if (this.DOMRect.width !== 0) {
                this.app.ticker.remove(getDOMRect, this);
                this._setWidget();
            }
        };
        this.app.ticker.add(getDOMRect, this);
    }

    static addCtn (parent, interactive) {
        let ctn = new PIXI.Container();
        interactive && (ctn.interactive = true);
        parent.addChild(ctn);
        return ctn;
    }

    static addSprite (parent, cacheName, x, y, interactive) {
        let sprite = new PIXI.Sprite(res[cacheName]);
        sprite.position.set(x, y);
        interactive && (sprite.interactive = true);
        parent.addChild(sprite);
        return sprite;
    }

    static addRect (parent, x, y, w, h, interactive, alpha, tint) {
        let rect = new PIXI.Graphics();
        rect.beginFill(tint || 0xFFFFFF, alpha || 0);
        rect.drawRect(x, y, w, h);
        interactive && (rect.interactive = true);
        parent.addChild(rect);
        return rect;
    }

    static addAnimation (parent, preName, fixName, num, x, y, speed) {
        var aniFrames = [];

        for (var i = 0; i < num; i++) {
            let texture = res[preName + i + fixName];
            aniFrames.push(texture);
        }

        var anim = new PIXI.extras.AnimatedSprite(aniFrames);
        anim.animationSpeed = speed;
        anim.loop = false;
        anim.position.set(x, y);

        parent.addChild(anim);

        return anim;
    }

    static addText (parent, text, x, y, fontSize, tint, align, fontWeight) {
        let textS = new PIXI.Text(text, {
            fontSize: fontSize,
            fill: tint,
            align: align,
            fontWeight: fontWeight
        });
        textS.position.set(x, y);

        parent.addChild(textS);

        return textS;
    }

    static show (target, duration, callback, delay) {
        if (target instanceof Array) {
            target.forEach(ele => {
                ele.alpha = 0;
                ele.visible = true;
            });
        } else {
            target.alpha = 0;
            target.visible = true;
        }
        gsap.to(target, duration || 0, {
            alpha: 1,
            delay: delay || 0,
            ease: 'none',
            onComplete: function () {
                callback && callback();
            }
        });
    }

    static hide (target, duration, callback, delay) {
        gsap.to(target, duration || 0, {
            alpha: 0,
            delay: delay || 0,
            ease: 'none',
            onComplete: function () {
                target.visible = false;
                callback && callback();
            }
        });
    }

    static setWidget (target, top, right, bottom, left) {
        this._setWidget([target, top, right, bottom, left]);
    }

    static _setWidget (param) {
        const set = (para) => {
            let target = para[0];
            para[1] && (target.y = -this.DOMRect.top * this.domStageRatio + para[1]);
            // right && (target.y = (this.DOMRect.width - this.DOMRect.x) * this.domStageRatio - right);
            para[3] && (target.y = (this.DOMRect.height + this.DOMRect.top) * this.domStageRatio - para[3]);
            // left && (target.x = this.DOMRect.x * this.domStageRatio + left);
            // TD.debug.log(2222);
            // TD.debug.log(this.DOMRect.y);
        };
        if (param) {
            set(param);
            this.widgetPool.push(param);
        } else {
            this.widgetPool.forEach(ele => {
                set(ele);
            });
        }
    }

    /**
     * 补位
     * @param {*} num
     * @param {*} n
     */
    static pad (num, n) {
        let tbl = [];
        n = n || 5;
        let len = n - num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
        return tbl[len] + num;
    }

    /**
     * 获取m~n的随机数
     * @param {Number} m
     * @param {Number} n
     * @param {Number} fly 是否向下取整
     */
    static getRandom (m, n, fly) {
        let rdm = Math.random() * (n - m) + m;
        return fly ? Math.floor(rdm) : rdm;
    }
};
