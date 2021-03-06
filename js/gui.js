yogo.GUI = function() {

    var coreHp = 0,
        coreHpDirty = true,
        score = 0,
        scoreDirty = true,
        timer = 0,
        staticDirty = true,
        backButtonDirty = true,
        activeTower = null,
        towerDirty = true;

    this.reset = function() {
        coreHpDirty = true;
        scoreDirty = true;
        staticDirty = true;
        backButtonDirty = true;
        towerDirty = true;
        activeTower = null;
    };

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
        this.addToScore(Math.floor(score * coreHp / 1000000));
    };

    this.getScore = function() {
        return score;
    };

    this.setTower = function(tower) {
        activeTower = tower;
        towerDirty = true;
    };

    this.updateTower = function() {
        towerDirty = true;
    };

    this.onClick = function(c) {
        // Check to see if they clicked an upgrade button
        if (activeTower !== null) {
            if (activeTower.canUpgradeDmg()) {
                if (c[0] > 672 && c[0] < 672 + 118 && c[1] > 385 && c[1] < 385 + 60) {
                    activeTower.upgradeDmg();
                }
            }
            if (activeTower.canUpgradeRange()) {
                if (c[0] > 672 && c[0] < 672 + 118 && c[1] > 480 && c[1] < 480 + 60) {
                    activeTower.upgradeRange();
                }
            }
        }

        // Or the menu button
        if (c[0] >= 672 && c[0] <= 672 + 118 && c[1] >= 10 && c[1] <= 10 + 35) {
            yogo.state.changeState('levels');
        }
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
            yogo.ctx.fillRect(662, 0, 138, 300);
            yogo.ctx.fillStyle = '#AAAAAA';
            yogo.ctx.fillText('Active Tower', 731, 325);
            staticDirty = false;
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
            yogo.ctx.fillText('Score : ' + score, 400, 19);
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
                yogo.ctx.fillText('Damage  :  ' + activeTower.dmg.toString(), 728, 370);
                // Range
                yogo.ctx.fillText('Range  :  ' + activeTower.range.toFixed(1), 728, 465);

                if (activeTower.canUpgradeDmg()) {
                    yogo.ctx.fillStyle = '#555555';
                    yogo.ctx.fillRect(672, 385, 118, 60);
                    yogo.ctx.fillStyle = '#AAAAAA';
                    yogo.ctx.fillText('upgrade', 732, 397);
                    yogo.ctx.fillText('next : ' + activeTower.getNextDmgLevel(), 732, 415);
                    yogo.ctx.fillText('time : ' + activeTower.getNextDmgUpgradeTime().toFixed(1) + ' s', 732, 433);
                }

                if (activeTower.canUpgradeRange()) {
                    yogo.ctx.fillStyle = '#555555';
                    yogo.ctx.fillRect(672, 480, 118, 60);
                    yogo.ctx.fillStyle = '#AAAAAA';
                    yogo.ctx.fillText('upgrade', 732, 397 + 95);
                    yogo.ctx.fillText('next : ' + activeTower.getNextRangeLevel().toFixed(1), 732, 415 + 95);
                    yogo.ctx.fillText('time : ' + activeTower.getNextRangeUpgradeTime().toFixed(1) + ' s', 732, 433 + 95);
                }

            } else {
                yogo.ctx.fillStyle = '#555555';
                yogo.ctx.fillText('None selected', 731, 450);
            }
            towerDirty = false;
        }

        if (backButtonDirty) {
            yogo.ctx.fillStyle = '#0071C1';
            yogo.ctx.fillRect(672, 10, 118, 35);
            yogo.ctx.font = '17pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'center';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillText('Menu', 672 + 59, 10 + 17);
            backButtonDirty = false;
        }

    }

};