yogo.Enemies = function(map) {

    var pool = [];

    this.spawn = function(x0, y0, name) {
        pool.push(new yogo.Enemy(x0, y0, name, 180, map));
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