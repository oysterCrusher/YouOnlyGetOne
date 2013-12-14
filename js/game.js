yogo.Game = function() {

    var map = new yogo.Map(),
        enemies = new yogo.Enemies(map),
        towers = new yogo.Towers(map);

    this.init = function() {
        map.loadMap(0);
    };

    this.enter = function() {
        enemies.spawn(0, 4, 'enemy1');
    };

    this.exit = function() {
        console.log('game exit');
    };

    this.onDown = function(c) {
        // Convert mouse coords to tile coords
        var tX = Math.floor(c[0] / 20),
            tY = Math.floor(c[1] / 20);
        if (towers.checkSpawn(tX, tY)) {
            towers.spawn(tX, tY, 'tower1');
        }
    };

    this.onUp = function() {
//        console.log('game onUp');
    };

    this.onMove = function(c) {
//        console.log('game onMove');
    };

    this.loadMap = function(n) {
        map.loadMap(n);
    };

    this.update = function(dt) {
        enemies.update(dt);
    };

    this.render = function() {
        yogo.ctx.fillStyle = '#303030';
        yogo.ctx.fillRect(0, 0, yogo.canvas.width, yogo.canvas.height);

        map.render();
        towers.render();
        enemies.render();
    };

};