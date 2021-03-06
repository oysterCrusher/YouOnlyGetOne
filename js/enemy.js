yogo.Enemy = function(x0, y0, spriteName, speed, map, gui) {

    this.directions = {
        right: 0,
        down: 1,
        left: 2,
        up: 3
        };

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
    this.gui = gui;
    this.hp = 1000;
    this.alive = true;

    this.spriteName = spriteName;
    // Size
    this.width = 12;
    this.height = 12;
    this.direction = this.directions.right;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    // Percentage progress made in one second (100 = 1 tile per second)
    this.speed = speed;
};

yogo.Enemy.prototype.update = function(dt) {
    if (this.alive) {
        this.progress += (dt * this.speed) / 1000;

        if (this.progress > 100) {
            this.x = this.nextX;
            this.y = this.nextY;
            this.findNextTile();
            this.progress -= 100;
            // Have we reached the core?
            if (this.map.isCore(this.x, this.y)) {
                this.map.damageCore(this.hp);
                this.alive = false;
            }
        }

        this.dX = Math.round((this.x + (this.nextX - this.x) * (this.progress / 100)) * 20 + 10 - this.halfWidth);
        this.dY = Math.round((this.y + (this.nextY - this.y) * (this.progress / 100)) * 20 + 10 - this.halfHeight);
    }
};

yogo.Enemy.prototype.findNextTile = function() {
    // Look up
    if (this.map.getPathValues(this.x, this.y - 1) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x;
        this.nextY = this.y - 1;
        this.direction = this.directions.up;
    } else
    // Look down
    if (this.map.getPathValues(this.x, this.y + 1) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x;
        this.nextY = this.y + 1;
        this.direction = this.directions.down;
    } else
    // Look left
    if (this.map.getPathValues(this.x - 1, this.y) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x - 1;
        this.nextY = this.y;
        this.direction = this.directions.left;
    } else
    // Look right
    if (this.map.getPathValues(this.x + 1, this.y) < this.map.getPathValues(this.x, this.y)) {
        this.nextX = this.x + 1;
        this.nextY = this.y;
        this.direction = this.directions.right;
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
        this.gui.addToScore(50);
        this.alive = false;
    }
};

yogo.Enemy.prototype.render = function() {
    if (this.alive) {
        yogo.ctx.drawImage(
            yogo.cache.sprites[this.spriteName],
            this.direction * 12,
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