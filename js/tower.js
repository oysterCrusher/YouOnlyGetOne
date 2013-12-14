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
    this.active = true;

    this.dX = this.x * 20;
    this.dY = this.y * 20;
//    this.dX = Math.round((this.x + (this.nextX - this.x) * (this.progress / 100)) * 20 + 10 - this.halfWidth);
//    this.dY = Math.round((this.y + (this.nextY - this.y) * (this.progress / 100)) * 20 + 10 - this.halfHeight);
};

yogo.Tower.prototype.update = function(dt) {

};

yogo.Tower.prototype.render = function() {
    yogo.ctx.drawImage(
        yogo.cache.sprites[this.spriteName],
        0,
        0,
        this.width,
        this.height,
        this.dX,
        this.dY,
        this.width,
        this.height
    );
};