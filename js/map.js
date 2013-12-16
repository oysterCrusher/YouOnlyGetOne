yogo.Map = function(g) {

    var gui = g,
        tiles = [],
        spawns,
        name,
        nSpawns = 0,
        nWave = 0,
        spawnInterval = 2200,
        spawnTimer = 0,
        waveTime = 15000,
        enemies,
        pathValues = [],
        width = 0,
        height = 0,
        tileWidth = 0,
        tileHeight = 0,
        coreX = 0,
        coreY = 0,
        coreHp = 10000,
        timer = 0;

    this.loadMap = function(e, n) {
        if (n < 0 && n > yogo.mapList.length) {
            console.log('error loading map: map doesn\'t exist');
        }

        enemies = e;
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
        coreHp = 10000;

        spawns = yogo.mapList[n].spawns;
        nSpawns = yogo.mapList[n].spawns.length;

        name = yogo.mapList[n].name;

        this.updatePath();
        gui.updateCoreHp(coreHp);
    };

    this.getMapName = function() {
        return name;
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
            i, j,
            coreSize = 3;

        for (i = 0; i < coreSize; i++) {
            for (j = 0; j < coreSize; j++) {
                pathValues[coreY + j][coreX + i] = dist;
                nodeQueue.push([coreX + i, coreY + j]);
            }
        }

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
        return (x >= coreX && x <= coreX + 2 && y >= coreY && y <= coreY + 2);
    };

    this.damageCore = function(d) {
        coreHp -= d;
        coreHp = Math.max(coreHp, 0);
        gui.updateCoreHp(coreHp);
    };

    this.getCoreHp = function() {
        return coreHp;
    };

    this.update = function(dt) {
        timer += dt;
        spawnTimer += dt;

        // Go through each spawn point and see if anything is due to spawn
        if (timer >= waveTime) {
            timer -= waveTime;
            spawnTimer = timer;
            nWave++;
            spawnInterval = Math.floor(spawnInterval * 0.95);
        }

        if (spawnTimer > spawnInterval && timer < 7500) {
            spawnTimer -= spawnInterval;
            // Spawn an enemy at a random spawn point
            var i = Math.floor(Math.random() * nSpawns);
            enemies.spawn(spawns[i].x, spawns[i].y, 'enemy1');
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
            60,
            60,
            coreX * 20,
            coreY * 20,
            60,
            60
        );
        // Core health
//        yogo.ctx.fillStyle = 'green';
//        yogo.ctx.fillRect(coreX * 20, coreY * 20 + 15, Math.max(40 * coreHp / 1000, 0), 9);
    }

};