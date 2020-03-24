export default class IndexViewController {
    getPos (e) {
        return {
            X: e.data.global.x,
            Y: e.data.global.y
        };
    }

    createImg () {
        let textWidth = PIXI.TextMetrics.measureText(curString, new PIXI.TextStyle({ fontSize: 32 })).width;// eslint-disable-line

        PX.app.renderer.render(PX.stage);
        var data = PX.app.renderer.view.toDataURL('image/jpeg', 0.6); // eslint-disable-line
    }
};
