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

    var isPlacingTower = false,
        towerBuildTime = 1500,
        towerBeingPlaced = { x: 0, y: 0, timer: 0, canvas: null, ctx: null };

    this.init = function() {
//        map.loadMap(enemies, 0);
        towerBeingPlaced.canvas = document.createElement('canvas');
        towerBeingPlaced.width = 39;
        towerBeingPlaced.height = 39;
        towerBeingPlaced.ctx = towerBeingPlaced.canvas.getContext('2d');
    };

    this.enter = function() {
        isPlacingTower = false;
    };

    this.exit = function() {

    };

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
            isPlacingTower = true;
            towers.disableAll();
            towerBeingPlaced.x = tX;
            towerBeingPlaced.y = tY;
            towerBeingPlaced.timer = 0;
        } else {
            gui.onClick(c);
        }
    };

    this.onUp = function() {
        isPlacingTower = false;
    };

    this.onMove = function(c) {
        var tX = Math.floor(c[0] / 20),
            tY = Math.floor(c[1] / 20);
        selectionHighlightPosition = [tX, tY];
    };

    this.loadMap = function(n) {
        map.loadMap(enemies, n);
        enemies.reset();
        towers.reset();
        gui.reset();
    };

    this.update = function(dt) {
        if (phase === PLAY_PHASE) {
            // Is the player currently building a tower?
            if (isPlacingTower) {
                towerBeingPlaced.timer += dt;
                if (towerBeingPlaced.timer >= towerBuildTime) {
                    isPlacingTower = false;
                    towers.spawn(towerBeingPlaced.x, towerBeingPlaced.y, 'tower1');
                }
                // Update the tower placement countdown graphic
                towerBeingPlaced.ctx.clearRect(0, 0, towerBeingPlaced.width, towerBeingPlaced.height);
                towerBeingPlaced.ctx.fillStyle = 'rgba(150,150,0,0.4)';
                towerBeingPlaced.ctx.beginPath();
                towerBeingPlaced.ctx.moveTo(20, 20);
                towerBeingPlaced.ctx.arc(20, 20, 35, -Math.PI / 2, Math.PI * (2 - 2 * towerBeingPlaced.timer / towerBuildTime - 0.5), false);
                towerBeingPlaced.ctx.closePath();
                towerBeingPlaced.ctx.fill();
            }


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

        if (isPlacingTower) {
            yogo.ctx.drawImage(
                towerBeingPlaced.canvas,
                0,
                0,
                towerBeingPlaced.width,
                towerBeingPlaced.height,
                towerBeingPlaced.x * 20,
                towerBeingPlaced.y * 20,
                towerBeingPlaced.width,
                towerBeingPlaced.height
            );
        }

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