yogo.Towers = function(map, enemies, gui) {

    var pool = [],
        currentActive = null;

    this.map = map;

    this.gui = gui;

    this.checkSpawn = function(x0, y0) {
        return (this.map.getTileValues(x0,y0) === 2
            && this.map.getTileValues(x0+1,y0) === 2
            && this.map.getTileValues(x0,y0+1) === 2
            && this.map.getTileValues(x0+1,y0+1) === 2);
    };

    this.spawn = function(x0, y0, name) {
        pool.push(new yogo.Tower(x0, y0, name, enemies, gui));
        this.map.setTileValue(x0, y0, 3);
        this.map.setTileValue(x0+1, y0, 3);
        this.map.setTileValue(x0, y0+1, 3);
        this.map.setTileValue(x0+1, y0+1, 3);
        this.map.updatePath();
        this.setActive(x0, y0);
    };

    this.setActive = function(x, y) {
        // Loop through the pool to see if there is a tower at these coords
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].isReady()) {
                if (pool[i].isAt(x, y)) {
                    this.disableAll();
                    pool[i].setActive(true);
                    currentActive = pool[i];
                    this.gui.setTower(currentActive);
                    return true;
                }
            }
        }
        return false;
    };

    this.disableAll = function() {
        for (var i = 0; i < pool.length; i++) {
            pool[i].setActive(false);
        }
        currentActive = null;
        this.gui.setTower(currentActive);
    };

    this.update = function(dt) {
        // Update the position of all the enemies
        for (var i = 0; i < pool.length; i++) {
            pool[i].update(dt);
        }
    };

    this.render = function() {
        for (var i = 0; i < pool.length; i++) {
            pool[i].render();
        }
    }

};