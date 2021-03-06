yogo.State = function() {

    var states = {},
        currentState = null,
        previousState = null,
        isDown = false,
        lastTime = 0,
        dt = 0,
        _this = this;

    this.init = function() {
        states.game = new yogo.Game();
        states.title = new yogo.Title();
        states.levels = new yogo.LevelSelect();
    };

    this.start = function() {
        // Initialise the states
        states.game.init();

        // Start the first state
        currentState = states.levels;
        currentState.enter();

        // Bind the mouse
        this.bindDown();
        this.bindMove();

        // Start update loop
        this.rafUpdate(0);
    };

    this.rafUpdate = function(time) {
        window.requestAnimationFrame(_this.rafUpdate);
        dt = time - lastTime;
        lastTime = time;
        dt = Math.min(dt, 75);
        currentState.update(dt);
        currentState.render();
    };

    this.changeState = function(newState) {
        this.unbindUp();
        isDown = false;
        currentState.exit();
        previousState = currentState;
        currentState = states[newState];
        currentState.enter();
    };

    this.loadLevel = function(nLevel) {
        states.game.loadMap(nLevel);
    };

    // Set up all the mouse (and maybe touch inputs
    this.bindDown = function() {
        yogo.canvas.addEventListener('mousedown', mousedownHandler, false);
    };

    this.bindUp = function() {
        yogo.canvas.addEventListener('mouseup', mouseupHandler, false);
    };

    this.unbindUp = function() {
        yogo.canvas.removeEventListener('mouseup', mouseupHandler, false);
    };

    this.bindMove = function() {
        yogo.canvas.addEventListener('mousemove', mousemoveHandler, false);
    };

//    this.unbindMove = function() {
//        yogo.canvas.removeEventListener('mousemove', mousemoveHandler, false);
//    };

    function mousedownHandler(evt) {
        if (isDown) { return; }
        isDown = true;

        _this.bindUp();
        currentState.onDown(getMouseCoords(evt));
    }

    function mouseupHandler() {
        isDown = false;
        _this.unbindUp();
        currentState.onUp();
    }

    function mousemoveHandler(evt) {
        currentState.onMove(getMouseCoords(evt));
    }

    function getMouseCoords(evt) {
        return [
            (evt.pageX - evt.target.getBoundingClientRect().left) / yogo.scale,
            (evt.pageY - evt.target.getBoundingClientRect().top) / yogo.scale
        ];
    }

};