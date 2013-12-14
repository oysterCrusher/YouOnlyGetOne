yogo.Tower = function(x0, y0, towerName, enemies) {
    // Position in tile coordinates
    this.x = x0;
    this.y = y0;
    this.spriteName = towerName;
    this.enemyList = enemies.getPool();
    // Size
    this.width = 40;
    this.height = 40;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    // Damage dealt over 1000 ms
    this.dmg = 70;

    this.rate = 2;
    this.active = false;
    this.sX = 40;
    this.target = null;
    this.range = 3;
    this.isShooting = false;

    this.dX = this.x * 20;
    this.dY = this.y * 20;
};

yogo.Tower.prototype.setActive = function(b) {
    this.active = b;
    if (this.active) {
        this.sX = 0;
    } else {
        this.sX = 40;
    }
    return this.active;
};

yogo.Tower.prototype.isReady = function() {
    return true;
};

yogo.Tower.prototype.isAt = function(x, y) {
    return (x >= this.x && x <= this.x + 1 && y >= this.y && y <= this.y + 1);
};

yogo.Tower.prototype.update = function(dt) {
    this.isShooting = false;
    if (this.active) {
        if (this.target === null) {
            this.searchForTarget();
        } else {
            // See if the target has moved out of range
            if (this.distanceToEnemy(this.target) > this.range) {
                this.searchForTarget();
            } else {
                this.shootTarget(dt);
            }
        }
    }
};

yogo.Tower.prototype.searchForTarget = function() {
    var distToTarget = this.range,
        distToEnemy = 0;

    this.target = null;

    for (var i = 0; i < this.enemyList.length; i++) {
        if (this.enemyList[i].isAlive) {

            if (this.distanceToEnemy(this.enemyList[i]) < distToTarget) {
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

yogo.Tower.prototype.render = function() {
    yogo.ctx.drawImage(
        yogo.cache.sprites[this.spriteName],
        this.sX,
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