yogo.GUI = function() {

    var coreHp = 0,
        coreHpDirty = true,
        score = 0,
        scoreDirty = true;

    this.updateCoreHp = function(newHp) {
        coreHp = newHp;
        coreHpDirty = true;
    };

    this.addToScore = function(s) {
        score += s;
        scoreDirty = true;
    };

    this.render = function() {
        yogo.ctx.fillStyle = '#808080';
        yogo.ctx.fillRect(33 * 20, 0, 2, yogo.canvas.height);

        if (coreHpDirty) {
            yogo.ctx.font = '10pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(33 * 20 + 10, 20, 120, 40);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Core HP : ' + coreHp, 34 * 20, 40);
            coreHpDirty = false;
        }

        if (scoreDirty) {
            yogo.ctx.font = '10pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(33 * 20 + 10, 50, 120, 40);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Score : ' + score, 34 * 20, 70);
            scoreDirty = false;
        }
    }

};