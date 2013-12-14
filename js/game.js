yogo.Game = function() {

    var map = new yogo.Map(),
        enemies = new yogo.Enemies(map),
        towers = new yogo.Towers(map, enemies),
        selectionHighlightPosition = [50,50];

    this.init = function() {
        map.loadMap(0);
    };

    this.enter = function() {
        enemies.spawn(-1, 10, 'enemy1');
        enemies.spawn(-1, 20, 'enemy1');
    };

//    this.exit = function() {
//        console.log('game exit');
//    };

    this.onDown = function(c) {
        // Convert mouse coords to tile coords
        var tX = Math.floor(c[0] / 20),
            tY = Math.floor(c[1] / 20);

        // Check to see if the click was on a tower
        if (towers.setActive(tX, tY)) {

        } else if (towers.checkSpawn(tX, tY)) {
            towers.spawn(tX, tY, 'tower1');
        }
    };

    this.onUp = function() {
//        console.log('game onUp');
    };

    this.onMove = function(c) {
        var tX = Math.floor(c[0] / 20),
            tY = Math.floor(c[1] / 20);
            selectionHighlightPosition = [tX, tY];
    };

    this.loadMap = function(n) {
        map.loadMap(n);
    };

    this.update = function(dt) {
        enemies.update(dt);
        towers.update(dt);
    };

    this.render = function() {
        yogo.ctx.fillStyle = '#303030';
        yogo.ctx.fillRect(0, 0, yogo.canvas.width, yogo.canvas.height);

        map.render();
        towers.render();
        enemies.render();

        // Render highlight box around mouse position
        if (selectionHighlightPosition[0] >= 0 && selectionHighlightPosition[0] < 34) {
            if (selectionHighlightPosition[1] >= 0 && selectionHighlightPosition[1] < 29) {
                yogo.ctx.drawImage(
                    yogo.cache.sprites['cursor'],
                    0,
                    0,
                    40,
                    40,
                    selectionHighlightPosition[0] * 20,
                    selectionHighlightPosition[1] * 20,
                    40,
                    40
                );
            }
        }

    };

};