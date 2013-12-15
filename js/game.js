yogo.Game = function() {

    var gui = new yogo.GUI(),
        map = new yogo.Map(gui),
        enemies = new yogo.Enemies(map, gui),
        towers = new yogo.Towers(map, enemies),
        selectionHighlightPosition = [50,50],
        secondsCounter = 0;

    this.init = function() {
        map.loadMap(enemies, 0);
    };

    this.enter = function() {
        console.log('entered game');
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
        map.loadMap(enemies, n);
    };

    this.update = function(dt) {
        map.update(dt);
        enemies.update(dt);
        towers.update(dt);
        secondsCounter += dt;
        if (secondsCounter >= 1000) {
            gui.addInterest();
            secondsCounter -= 1000;
        }
    };

    this.render = function() {
        yogo.ctx.fillStyle = '#303030';
        yogo.ctx.fillRect(0, 0, 33 * 20, yogo.canvas.height);

        map.render();
        towers.render();
        enemies.render();

        // Render highlight box around mouse position
        if (selectionHighlightPosition[0] >= 0 && selectionHighlightPosition[0] < 32) {
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

        // Render the GUI elements
        gui.render();

    };

};