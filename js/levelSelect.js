yogo.LevelSelect = function() {

    var redrawAll = true,
        button1Hover = false,
        button1Dirty = true,
        backButtonHover = false,
        backButtonDirty = true;

    this.init = function() {

    };

    this.enter = function() {
        redrawAll = true;
        button1Hover = false;
        backButtonHover = false;
    };

    this.exit = function() {

    };

    this.onDown = function(c) {
        // Load level 1
        if (c[1] >= 180 && c[1] < 225 && c[0] > 100) {
            yogo.state.changeState('game');
        }

        // Back button
        if (c[1] >= 520 && c[1] < 565 && c[0] < 200) {
            yogo.state.changeState('title');
        }
    };

    this.onMove = function(c) {
        // Is the mouse over button1
        if (c[1] >= 180 && c[1] < 225 && c[0] > 100) {
            if (!button1Hover) {
                button1Dirty = true;
            }
            button1Hover = true;
        } else {
            if (button1Hover) {
                button1Dirty = true;
            }
            button1Hover = false;
        }

        // Is the mouse over the back button
        if (c[1] >= 520 && c[1] < 565 && c[0] < 200) {
            if (!backButtonHover) {
                backButtonDirty = true;
            }
            backButtonHover = true;
        } else {
            if (backButtonHover) {
                backButtonDirty = true;
            }
            backButtonHover = false;
        }
    };

    this.onUp = function() {

    };

    this.update = function(dt) {

    };

    this.render = function() {

        if (redrawAll) {
            // Background
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillRect(0, 0, yogo.canvas.width, yogo.canvas.height);
        }

        if (button1Dirty || redrawAll) {
            if (button1Hover) {
                yogo.ctx.fillStyle = '#BBBBBB';
                yogo.canvas.style.cursor = "pointer";
            } else {
                yogo.ctx.fillStyle = '#0071C1';
                yogo.canvas.style.cursor = "default";
            }
            yogo.ctx.fillRect(100, 180, 700, 45);
            yogo.ctx.font = '21pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'left';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillText('Best : ', 120, 200);
            if (localStorage.getItem('yogo_L1_score')) {
                yogo.ctx.fillText(localStorage.getItem('yogo_L1_score'), 210, 200);
            } else {
                yogo.ctx.fillStyle = '#454545';
                yogo.ctx.fillText('Not set', 210, 200);
            }

            button1Dirty = false;
        }

        if (backButtonDirty || redrawAll) {
            if (backButtonHover) {
                yogo.ctx.fillStyle = '#BBBBBB';
                yogo.canvas.style.cursor = "pointer";
            } else {
                yogo.ctx.fillStyle = '#0071C1';
                yogo.canvas.style.cursor = "default";
            }
            yogo.ctx.fillRect(0, 520, 200, 45);
            yogo.ctx.font = '21pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'right';
            yogo.ctx.fillStyle = '#303030';
            yogo.ctx.fillText('<  Back', 180, 540);
            backButtonDirty = false;
        }

        redrawAll = false;

    };

};