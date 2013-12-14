window.onload = function() {

    // Set up the canvas
    yogo.canvas = document.getElementById('yogo');
    yogo.canvas.width = 800;
    yogo.canvas.height = 600;
    yogo.ctx = yogo.canvas.getContext('2d');
    yogo.state = new yogo.State();

    // Set up a sprite and map cache
    yogo.cache = {
        sprites: {},
        maps: {}
    };

    // Give it a loading image
    yogo.ctx.fillStyle = '#303030';
    yogo.ctx.fillRect(0, 0, yogo.canvas.width, yogo.canvas.height);

    // Grab the loading image
    yogo.cache.sprites['loading'] = new Image();
    yogo.cache.sprites['loading'].onload = function() {
        yogo.ctx.drawImage(yogo.cache.sprites['loading'], 0, 0, 186, 49, 307, 270, 186, 49);
        beginLoad();
    };
    yogo.cache.sprites['loading'].src = 'assets/loading.png';

    function beginLoad() {
        var nSpritesRemaining = yogo.spriteList.length,
            nMapsRemaining = yogo.mapList.length,
            i;

        // Set all the sprites loading
        for (i = 0; i < nSpritesRemaining; i++) {
            yogo.cache.sprites[yogo.spriteList[i].name] = new Image();
            yogo.cache.sprites[yogo.spriteList[i].name].onload = function() {
                nSpritesRemaining--;
                if (nSpritesRemaining === 0 && nMapsRemaining === 0) {
                    console.log('all sprites loaded');
                    yogo.state.init();
                    yogo.state.start();
                }
            };
            yogo.cache.sprites[yogo.spriteList[i].name].src = yogo.spriteList[i].url;
        }

        // Set all the maps loading
        for (i = 0; i < nMapsRemaining; i++) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', yogo.mapList[i].url, true);
            xhr.responseType = 'text';
            xhr.onload = function(i) {
                return function() {
                    nMapsRemaining--;
                    yogo.cache.maps[yogo.mapList[i].name] = JSON.parse(this.responseText);
                    if (nSpritesRemaining === 0 && nMapsRemaining === 0) {
                        console.log('all maps loaded');
                        yogo.state.init();
                        yogo.state.start();
                    }
                };
            }(i);
            xhr.send();
        }
    }

};