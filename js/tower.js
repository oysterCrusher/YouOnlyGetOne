yogo.Tower = function(x0, y0, towerName) {
    // Position in tile coordinates
    this.x = x0;
    this.y = y0;
    this.spriteName = towerName;
    // Size
    this.width = yogo.cache.sprites[this.spriteName].width;
    this.height = yogo.cache.sprites[this.spriteName].height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    // Percentage progress made in one second (100 = 1 tile per second)
    this.dmg = 10;
    this.rate = 2;
    this.active = false;
    this.sX = 40;

    this.dX = this.x * 20;
    this.dY = this.y * 20;
//    this.dX = Math.round((this.x + (this.nextX - this.x) * (this.progress / 100)) * 20 + 10 - this.halfWidth);
//    this.dY = Math.round((this.y + (this.nextY - this.y) * (this.progress / 100)) * 20 + 10 - this.halfHeight);
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

};

yogo.Tower.prototype.render = function() {
    yogo.ctx.drawImage(
        yogo.cache.sprites[this.spriteName],
        this.sX,
        0,
        40,
        this.height,
        this.dX,
        this.dY,
        40,
        this.height
    );
};