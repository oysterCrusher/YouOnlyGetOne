yogo.Towers = function(map) {

    var pool = [];
    this.map = map;

    this.checkSpawn = function(x0, y0) {
        return (this.map.getTileValues(x0,y0) === 2
            && this.map.getTileValues(x0+1,y0) === 2
            && this.map.getTileValues(x0,y0+1) === 2
            && this.map.getTileValues(x0+1,y0+1) === 2);
    };

    this.spawn = function(x0, y0, name) {
        pool.push(new yogo.Tower(x0, y0, name));
        this.map.setTileValue(x0, y0, 3);
        this.map.setTileValue(x0+1, y0, 3);
        this.map.setTileValue(x0, y0+1, 3);
        this.map.setTileValue(x0+1, y0+1, 3);
        this.map.updatePath();
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