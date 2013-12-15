yogo.Map = function(g) {

    var gui = g,
        tiles = [],
        spawns,
        enemies,
        pathValues = [],
        width = 0,
        height = 0,
        tileWidth = 0,
        tileHeight = 0,
        coreX = 0,
        coreY = 0,
        coreHp = 1000,
        timer = 0;

    this.loadMap = function(e, n) {
        if (n < 0 && n > yogo.mapList.length) {
            console.log('error loading map: map doesn\'t exist');
        }

        enemies = e;
        console.log('loading map');
        // Load the tile data
        width = yogo.cache.maps[yogo.mapList[n].name].width;
        height = yogo.cache.maps[yogo.mapList[n].name].height;

        tileWidth = yogo.cache.maps[yogo.mapList[n].name].tilewidth;
        tileHeight = yogo.cache.maps[yogo.mapList[n].name].tileheight;

        tiles = [];
        for (var y = 0; y < height; y++) {
            tiles.push([]);
            pathValues.push([]);
            for (var x = 0; x < width; x++) {
                tiles[y].push(yogo.cache.maps[yogo.mapList[n].name].layers[0].data[y * width + x]);
                pathValues[y].push(-1);
            }
        }

        coreX = yogo.mapList[n].coreX;
        coreY =  yogo.mapList[n].coreY;
        spawns = yogo.mapList[n].spawns;

        for (var i = 0; i < spawns.length; i++) {
            spawns[i].nextSpawn = 0;
        }

        this.updatePath();
        gui.updateCoreHp(coreHp);
    };

    this.resetPathValues = function() {
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                pathValues[y][x] = 20000;
            }
        }
    };

    this.getPathValues = function(x, y) {
        if (x < 0 || y < 0 || x >= pathValues[0].length || y >= pathValues.length) {
            return 30000;
        } else {
            return pathValues[y][x];
        }
    };

    this.getTileValues = function(x, y) {
        return tiles[y][x];
    };

    this.setTileValue = function(x, y, v) {
        tiles[y][x] = v;
    };

    this.updatePath = function() {
        this.resetPathValues();
        var nodeQueue = [],
            dist = 0,
            cX,
            cY,
            i;

        pathValues[coreY][coreX] = dist;
        nodeQueue.push([coreX, coreY]);
        pathValues[coreY+1][coreX] = dist;
        nodeQueue.push([coreX, coreY+1]);
        pathValues[coreY][coreX+1] = dist;
        nodeQueue.push([coreX+1, coreY]);
        pathValues[coreY+1][coreX+1] = dist;
        nodeQueue.push([coreX+1, coreY+1]);

        while (nodeQueue.length > 0) {
            cX = nodeQueue[0][0];
            cY = nodeQueue[0][1];
            nodeQueue.shift();
            dist = pathValues[cY][cX];
            var dirs = [];

            if (cY > 0) {
                dirs.push([0, -1]);
            }
            if (cY < 29) {
                dirs.push([0, 1]);
            }
            if (cX > 0) {
                dirs.push([-1, 0]);
            }
            if (cX < 39) {
                dirs.push([1, 0]);
            }

            for (i = 0; i < dirs.length; i++) {
                if (tiles[cY+dirs[i][1]][cX+dirs[i][0]] === 3) {
                    if (dist < 10000) {
                        if (pathValues[cY+dirs[i][1]][cX+dirs[i][0]] > dist + 10001) {
                            pathValues[cY+dirs[i][1]][cX+dirs[i][0]] = dist + 10001;
                            nodeQueue.push([cX + dirs[i][0], cY + dirs[i][1]]);
                        }
                    } else if (pathValues[cY+dirs[i][1]][cX+dirs[i][0]] > dist + 1) {
                        pathValues[cY+dirs[i][1]][cX+dirs[i][0]] = dist + 1;
                        nodeQueue.push([cX + dirs[i][0], cY + dirs[i][1]]);
                    }
                } else if (tiles[cY+dirs[i][1]][cX+dirs[i][0]] !== 0) {
                    if (pathValues[cY+dirs[i][1]][cX+dirs[i][0]] > dist + 1) {
                        pathValues[cY+dirs[i][1]][cX+dirs[i][0]] = dist + 1;
                        nodeQueue.push([cX + dirs[i][0], cY + dirs[i][1]]);
                    }
                }
            }
        }
    };

    this.isCore = function(x, y) {
        return (x >= coreX && x <= coreX + 1 && y >= coreY && y <= coreY + 1);
    };

    this.damageCore = function(d) {
        coreHp -= d;
        gui.updateCoreHp(coreHp);
    };

    this.update = function(dt) {
        timer += dt;

        // Go through each spawn point and see if anything is due to spawn
        for (var i = 0; i < spawns.length; i++) {
            if (spawns[i].nextSpawn >= spawns[i].queue.length) {
                continue;
            }
            if (spawns[i].queue[spawns[i].nextSpawn].time * 1000 <= timer) {
                enemies.spawn(spawns[i].x, spawns[i].y, spawns[i].queue[spawns[i].nextSpawn].name);
                spawns[i].nextSpawn++;
            }
        }
    };

    this.render = function() {
        // All the tiles
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (tiles[y][x] === 0) {
                    continue;
                }
                yogo.ctx.drawImage(
                    yogo.cache.sprites['tileset'],
                    (tiles[y][x] - 1) * tileWidth,
                    0,
                    tileWidth,
                    tileHeight,
                    x * tileWidth,
                    y * tileHeight,
                    tileWidth,
                    tileHeight
                );
            }
        }

        // The core
        yogo.ctx.drawImage(
            yogo.cache.sprites['core'],
            0,
            0,
            40,
            40,
            coreX * 20,
            coreY * 20,
            40,
            40
        );
        // Core health
        yogo.ctx.fillStyle = 'green';
        yogo.ctx.fillRect(coreX * 20, coreY * 20 + 15, Math.max(40 * coreHp / 1000, 0), 9);
    }

};