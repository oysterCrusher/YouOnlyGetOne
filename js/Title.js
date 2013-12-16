yogo.Title = function() {

    var titleString = 'Power Core Defense',
        redrawAll = true,
        playButtonHover = false,
        playButtonDirty = true;

    this.init = function() {

    };

    this.enter = function() {
        redrawAll = true;
        playButtonHover = false;
    };

    this.exit = function() {

    };

    this.onDown = function(c) {

        // Did they click the play button?
        if (c[1] >= 180 && c[1] < 225 && c[0] > 100) {
            yogo.state.changeState('levels');
        }

    };

    this.onMove = function(c) {

        // Is the mouse over the play button
        if (c[1] >= 180 && c[1] < 225 && c[0] > 100) {
            if (!playButtonHover) {
                playButtonDirty = true;
            }
            playButtonHover = true;
        } else {
            if (playButtonHover) {
                playButtonDirty = true;
            }
            playButtonHover = false;
        }

        //
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

            // Title
            yogo.ctx.font = '25pt "Open Sans" Sans-Serif';
            yogo.ctx.textBaseline = 'middle';
            yogo.ctx.textAlign = 'left';
            yogo.ctx.fillStyle = '#BBBBBB';
            yogo.ctx.fillText(titleString, 40, 50);
        }

        if (redrawAll || playButtonDirty) {
            if (playButtonHover) {
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
            yogo.ctx.fillText('Play', 120, 200);

            playButtonDirty = false;
        }

        redrawAll = false;

    };

};