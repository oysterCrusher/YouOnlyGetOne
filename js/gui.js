yogo.GUI = function() {

    var coreHp = 0,
        coreHpDirty = true,
        score = 0,
        scoreDirty = true,
        timer = 0,
        staticDirty = true,
        activeTower = null,
        towerDirty = true;

    this.updateCoreHp = function(newHp) {
        coreHp = newHp;
        coreHpDirty = true;
        if (coreHp < 0) {
            coreHp = 0;
        }
    };

    this.addToScore = function(s) {
        score += s;
        scoreDirty = true;
    };

    this.addInterest = function() {
        console.log("adding interest :" + Math.floor(score * coreHp / 1000000));
        this.addToScore(Math.floor(score * coreHp / 1000000));
    };

    this.getScore = function() {
        return score;
    };

    this.setTower = function(tower) {
        activeTower = tower;
        towerDirty = true;
    };

    this.update = function(dt) {
        timer += dt;
        // Add interest every second
        if (timer >= 2500) {
            this.addInterest();
            timer -= 2500;
        }
    };

    this.render = function() {

        if (staticDirty) {
            yogo.ctx.fillStyle = '#808080';
            yogo.ctx.fillRect(0, 38, yogo.canvas.width - 140, 2);
            yogo.ctx.fillRect(660, 0, 2, yogo.canvas.height);
            yogo.ctx.fillRect(662, 300, 138, 2);
            yogo.ctx.font = '12pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'center';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(662, 302, 138, 40);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Active Tower', 731, 325);
        }

        if (coreHpDirty) {
            yogo.ctx.font = '12pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'left';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(0, 0, 260, 38);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Core HP : ' + coreHp, 20, 19);
            yogo.ctx.fillStyle = '#881010';
            yogo.ctx.fillRect(150, 15, 100, 10);
            yogo.ctx.fillStyle = '#108810';
            yogo.ctx.fillRect(150, 15, 100 * coreHp / 10000, 10);
            coreHpDirty = false;
        }

        if (scoreDirty) {
            yogo.ctx.font = '12pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'left';
            yogo.ctx.fillStyle = '#303030';
//            yogo.ctx.fillStyle = 'blue';
            yogo.ctx.fillRect(260, 0, 260, 38);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Score : ' + score, 300, 19);
            scoreDirty = false;
        }

        if (towerDirty) {
            yogo.ctx.font = '10pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'center';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(662, 342, 138, 258);
            if (activeTower !== null) {
                yogo.ctx.fillStyle = '#AAAAAA';
                // DPS
                yogo.ctx.fillText('DPS  :  ' + activeTower.dmg.toString(), 728, 370);
                // Range
                yogo.ctx.fillText('Range  :  ' + activeTower.range.toString(), 728, 440);
            } else {
                yogo.ctx.fillStyle = '#555555';
                yogo.ctx.fillText('None selected', 731, 450);
            }
            towerDirty = false;
        }

    }

};