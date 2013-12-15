yogo.Game = function() {

    var gui = new yogo.GUI(),
        map = new yogo.Map(gui),
        enemies = new yogo.Enemies(map, gui),
        towers = new yogo.Towers(map, enemies, gui),
        selectionHighlightPosition = [50,50],
        phase = 0;

    var SETUP_PHASE = 0,
        PLAY_PHASE = 1,
        FINISHED_PHASE = 2;

    this.init = function() {
        map.loadMap(enemies, 0);
    };

    this.enter = function() {
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
            if (phase === SETUP_PHASE) {
                phase = PLAY_PHASE;
            }
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
        if (phase === PLAY_PHASE) {
            map.update(dt);
            enemies.update(dt);
            towers.update(dt);
            gui.update(dt);

            // Is the game over?
            if (map.getCoreHp() === 0) {
                phase = FINISHED_PHASE;
                if (yogo.hasLocalStorage) {
                    var prevBest = localStorage.getItem('yogo_L' + map.getMapName() + '_score');
                    if (gui.getScore() > prevBest) {
                        localStorage.setItem('yogo_L' + map.getMapName() + '_score', gui.getScore().toString());
                    }
                }
            }

        }
    };

    this.render = function() {
        yogo.ctx.fillStyle = '#303030';
        yogo.ctx.fillRect(0, 40, 33 * 20, yogo.canvas.height - 40);

        map.render();
        towers.render();
        enemies.render();

        // Render highlight box around mouse position
        if (selectionHighlightPosition[0] >= 0 && selectionHighlightPosition[0] < 32) {
            if (selectionHighlightPosition[1] >= 2 && selectionHighlightPosition[1] < 29) {
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