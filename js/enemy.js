yogo.Enemy = function(x0, y0, spriteName, speed, map) {
    // Position in tile coordinates
    this.x = x0;
    this.y = y0;
    // Coordinates of the next tile
    this.nextX = x0 + 1;
    this.nextY = y0;
    // Tile progress as percentage of distance to next tile
    this.progress = 0;
    this.dX = 0;
    this.dY = 0;
    this.map = map;
    this.hp = 1000;
    this.alive = true;

    this.spriteName = spriteName;
    // Size
    this.width = yogo.cache.sprites[spriteName].width;
    this.height = yogo.cache.sprites[spriteName].height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    // Percentage progress made in one second (100 = 1 tile per second)
    this.speed = speed;
};

yogo.Enemy.prototype.update = function(dt) {
    this.progress += (dt * this.speed) / 1000;

    if (this.progress > 100) {
        this.x = this.nextX;
        this.y = this.nextY;
        this.findNextTile();
        this.progress -= 100;
    }

    this.dX = Math.round((this.x + (this.nextX - this.x) * (this.progress / 100)) * 20 + 10 - this.halfWidth);
    this.dY = Math.round((this.y + (this.nextY - this.y) * (this.progress / 100)) * 20 + 10 - this.halfHeight);

};

yogo.Enemy.prototype.findNextTile = function() {
    // Look up
    if (this.map.getPathValues(this.x, this.y - 1) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x;
        this.nextY = this.y - 1;
    } else
    // Look down
    if (this.map.getPathValues(this.x, this.y + 1) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x;
        this.nextY = this.y + 1;
    } else
    // Look left
    if (this.map.getPathValues(this.x - 1, this.y) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x - 1;
        this.nextY = this.y;
    } else
    // Look right
    if (this.map.getPathValues(this.x + 1, this.y) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x + 1;
        this.nextY = this.y;
    }
};

yogo.Enemy.prototype.isAlive = function() {
    return this.alive;
};

yogo.Enemy.prototype.getPosition = function() {
    var xPos = (this.x + (this.nextX - this.x) * (this.progress / 100)) + 0.5;
    var yPos = (this.y + (this.nextY - this.y) * (this.progress / 100)) + 0.5;
    return [xPos, yPos];
};

yogo.Enemy.prototype.takeDamage = function(d) {
    this.hp -= d;
    if (this.hp <= 0) {
        this.alive = false;
    }
};

yogo.Enemy.prototype.render = function() {
    if (this.alive) {
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
        if (this.hp < 1000) {
            yogo.ctx.fillStyle = 'red';
            yogo.ctx.fillRect(this.dX, this.dY - 8, this.width, 3);
            yogo.ctx.fillStyle = 'green';
            yogo.ctx.fillRect(this.dX, this.dY - 8, this.width * this.hp / 1000, 3);
        }
    }
};