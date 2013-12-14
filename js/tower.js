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
    this.dmg = 500;

//    this.rate = 2;
    this.active = false;
    this.target = null;
    this.angleToTarget = 0;
    this.range = 3.2;
    this.isShooting = false;

    this.buildTime = 2000;
    this.buildProgress = 0;

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

yogo.Tower.prototype.update = function(dt) {
    this.isShooting = false;

    if (this.active) {
        if (this.buildProgress < this.buildTime) {
            this.buildProgress += dt;
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
    if (this.buildProgress < this.buildTime) {
        this.ctx.fillStyle = 'rgba(0,150,0,0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.arc(20, 20, 35, -Math.PI / 2, Math.PI * (2 - 2 * this.buildProgress / this.buildTime - 0.5), false);
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