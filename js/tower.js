yogo.Tower = function(x0, y0, towerName, enemies, gui) {
    // Position in tile coordinates
    this.x = x0;
    this.y = y0;
    this.spriteName = towerName;
    this.enemyList = enemies.getPool();
    this.gui = gui;
    // Size
    this.width = 40;
    this.height = 40;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    // Upgrade timings
    this.upgradeTimings = [0, 1.5, 1.7, 1.8, 1.9];

    // Damage dealt over 1000 ms
    this.dmgLevel = 0;
    this.dmgLevels = [250, 275, 300, 325, 350];
    this.dmg = this.dmgLevels[this.dmgLevel];

    // Firing range
    this.rangeLevel = 0;
    this.rangeLevels = [2.8, 3.0, 3.2, 3.4, 3.6];
    this.range = this.rangeLevels[this.rangeLevel];

    this.active = false;
    this.target = null;
    this.angleToTarget = 0;

    this.isShooting = false;

    this.isBuilding = true;
    this.buildTime = 2000;
    this.buildProgress = 0;

    this.isUpgradingDmg = false;
    this.isUpgradingRange = false;
    this.upgradeTime = 0;
    this.upgradeTimer = 0;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 39;
    this.canvas.height = 39;
    this.ctx = this.canvas.getContext('2d');

    this.dX = this.x * 20;
    this.dY = this.y * 20;
};

yogo.Tower.prototype.setActive = function(b) {
    this.active = b;
    return this.active;
};

yogo.Tower.prototype.isReady = function() {
    return true;
};

yogo.Tower.prototype.isAt = function(x, y) {
    return (x >= this.x && x <= this.x + 1 && y >= this.y && y <= this.y + 1);
};

yogo.Tower.prototype.canUpgradeRange = function() {
    return this.rangeLevel < this.rangeLevels.length - 1 && !this.isUpgradingDmg && !this.isUpgradingRange && !this.isBuilding;
};

yogo.Tower.prototype.canUpgradeDmg = function() {
    return this.dmgLevel < this.dmgLevels.length - 1 && !this.isUpgradingDmg && !this.isUpgradingRange && !this.isBuilding;
};

yogo.Tower.prototype.getNextRangeLevel = function() {
    return this.rangeLevels[this.rangeLevel+1];
};

yogo.Tower.prototype.getNextDmgLevel = function() {
    return this.dmgLevels[this.dmgLevel+1];
};

yogo.Tower.prototype.getNextRangeUpgradeTime = function() {
    return this.upgradeTimings[this.rangeLevel+1];
};

yogo.Tower.prototype.getNextDmgUpgradeTime = function() {
    return this.upgradeTimings[this.dmgLevel+1];
};

yogo.Tower.prototype.upgradeRange = function() {
    this.upgradeTimer = 0;
    this.upgradeTime = this.upgradeTimings[this.rangeLevel + 1] * 1000;
    this.isUpgradingRange = true;
    this.gui.updateTower();
};

yogo.Tower.prototype.upgradeDmg = function() {
    this.upgradeTimer = 0;
    this.upgradeTime = this.upgradeTimings[this.dmgLevel + 1] * 1000;
    this.isUpgradingDmg = true;
    this.gui.updateTower();
};

yogo.Tower.prototype.update = function(dt) {
    this.isShooting = false;

    if (this.active) {
        if (this.isBuilding) {
            this.buildProgress += dt;
            if (this.buildProgress >= this.buildTime) {
                this.isBuilding = false;
                this.gui.updateTower();
            }
        } else if (this.isUpgradingRange) {
            this.upgradeTimer += dt;
            if (this.upgradeTimer >= this.upgradeTime) {
                this.isUpgradingRange = false;
                this.rangeLevel++;
                this.range = this.rangeLevels[this.rangeLevel];
                this.gui.updateTower();
            }
        } else if (this.isUpgradingDmg) {
            this.upgradeTimer += dt;
            if (this.upgradeTimer >= this.upgradeTime) {
                this.isUpgradingDmg = false;
                this.dmgLevel++;
                this.dmg = this.dmgLevels[this.dmgLevel];
                this.gui.updateTower();
            }
        } else {
            // See if we need a new target
            if (this.target === null) {
                this.searchForTarget();
            } else if (!this.target.isAlive()) {
                this.searchForTarget();
            } else if (this.distanceToEnemy(this.target) > this.range) {
                this.searchForTarget();
            }

            // Do we have a target to shoot at?
            if (this.target !== null) {
                this.angleToTarget = this.getAngleToTarget();
                if (this.target.isAlive() && this.distanceToEnemy(this.target) <= this.range) {
                    this.shootTarget(dt);
                }
            }
        }
    }

    this.updateSprite();
};

yogo.Tower.prototype.updateSprite = function() {
    this.ctx.fillStyle = '#404B54';
    this.ctx.fillRect(0, 0, 39, 39);
    this.ctx.save();
    this.ctx.translate(20, 20);
    this.ctx.rotate(this.angleToTarget);
    this.ctx.drawImage(
        yogo.cache.sprites[this.spriteName],
        0,
        0,
        this.width,
        this.height,
        -20,
        -20,
        this.width,
        this.height
    );
    this.ctx.restore();
    if (this.isBuilding) {
        this.ctx.fillStyle = 'rgba(0,150,0,0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.arc(20, 20, 35, -Math.PI / 2, Math.PI * (2 - 2 * this.buildProgress / this.buildTime - 0.5), false);
        this.ctx.closePath();
        this.ctx.fill();
    }
    if (this.isUpgradingRange) {
        this.ctx.fillStyle = 'rgba(0,150,150,0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.arc(20, 20, 35, -Math.PI / 2, Math.PI * (2 - 2 * this.upgradeTimer / this.upgradeTime - 0.5), false);
        this.ctx.closePath();
        this.ctx.fill();
    }
    if (this.isUpgradingDmg) {
        this.ctx.fillStyle = 'rgba(150,0,150,0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.arc(20, 20, 35, -Math.PI / 2, Math.PI * (2 - 2 * this.upgradeTimer / this.upgradeTime - 0.5), false);
        this.ctx.closePath();
        this.ctx.fill();
    }
};

yogo.Tower.prototype.searchForTarget = function() {
    var distToTarget = this.range;

    this.target = null;

    for (var i = 0; i < this.enemyList.length; i++) {
        if (this.enemyList[i].isAlive()) {
            if (this.distanceToEnemy(this.enemyList[i]) < distToTarget) {
                distToTarget = this.distanceToEnemy(this.enemyList[i]);
                this.target = this.enemyList[i];
            }
        }
    }
};

yogo.Tower.prototype.distanceToEnemy = function(e) {
    var eX,
        eY;
    eX = e.getPosition()[0];
    eY = e.getPosition()[1];
    return Math.sqrt((this.x + 1 - eX) * (this.x + 1 - eX) + (this.y + 1 - eY) * (this.y + 1 - eY));
};

yogo.Tower.prototype.shootTarget = function(dt) {
    if (this.target === null) {
        return;
    }
    if (this.target.isAlive()) {
        this.isShooting = true;
        this.target.takeDamage(Math.round(dt * this.dmg / 1000));
    }
};

yogo.Tower.prototype.getAngleToTarget = function() {
    var ang = Math.atan((this.y + 1 - this.target.getPosition()[1]) / (this.x + 1 - this.target.getPosition()[0])) - Math.PI / 2;
    if (this.x + 1 - this.target.getPosition()[0] > 0) {
        return ang;
    } else {
        return ang - Math.PI;
    }
};

yogo.Tower.prototype.render = function() {

    if (this.active) {
        yogo.ctx.strokeStyle = 'rgba(10,10,10,0.3)';
        yogo.ctx.fillStyle = 'rgba(40,40,40,0.2)';
        yogo.ctx.beginPath();
        yogo.ctx.arc(this.x * 20 + this.halfWidth, this.y * 20 + this.halfHeight, this.range * 20, 0, 2 * Math.PI, false);
        yogo.ctx.fill();
        yogo.ctx.stroke();
    }

    // Draw the tower canvas
    yogo.ctx.drawImage(
        this.canvas,
        0,
        0,
        this.width,
        this.height,
        this.dX,
        this.dY,
        this.width,
        this.height
    );

    if (this.isShooting) {
        yogo.ctx.strokeStyle = 'red';
        yogo.ctx.beginPath();
        yogo.ctx.moveTo(this.x * 20 + this.halfWidth, this.y * 20 + this.halfHeight);
        yogo.ctx.lineTo(this.target.getPosition()[0] * 20, this.target.getPosition()[1] * 20);
        yogo.ctx.stroke();
    }
};