Buttons = {};

Buttons.Button = function(x, y, w, h, imgArray, click, hImgArray) {
	this.x = x;
	this.y = y;
    this.x0 = x;
    this.y0 = y;
	this.w = w;
	this.h = h;
    this.sx = imgArray[1];
    this.sy = imgArray[2];
    this.img = imgArray[0];
	this.iImg = imgArray[0];
    this.iSX = imgArray[1];
    this.iSY = imgArray[2];
	this.click = click;
    this.highlightOnClick = false;
    this.hImg = null;
    this.hSX = null;
    this.hSY = null;
    if (hImgArray !== undefined) {
        this.highlightOnClick = true;
        this.hImg = hImgArray[0];
        this.hSX = hImgArray[1];
        this.hSY = hImgArray[2];
    }
};

Buttons.Button.prototype.render = function(ctx) {
    ctx.drawImage(this.img,
                  this.sx,
                  this.sy,
                  this.w,
                  this.h,
                  this.x,
                  this.y,
                  this.w,
                  this.h);
};

Buttons.Button.prototype.reset = function() {
    this.x = this.x0;
    this.y = this.y0;
    this.img = this.iImg;
    this.sx = this.iSX;
    this.sy = this.iSY;
};

Buttons.Buttons = function() {
	this.buttonList = [];
	
	this.addButton = function(x, y, w, h, img, click, img2) {
		var newButton = new Buttons.Button(x, y, w, h, img, click, img2);
		this.buttonList.push(newButton);
	};
	
	this.render = function(ctx) {
		for (var i = 0; i < this.buttonList.length; i++) {
			this.buttonList[i].render(ctx);
		}
	};

    this.shiftButtons = function(dX, dY) {
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].x = this.buttonList[i].x0 + dX;
            this.buttonList[i].y = this.buttonList[i].y0 + dY;
        }
    };

	this.mouseClick = function(mX, mY) {
		for (var i = 0; i < this.buttonList.length; i++) {
			if (mY >= this.buttonList[i].y && mY <= this.buttonList[i].y + this.buttonList[i].h) {
				if (mX >= this.buttonList[i].x && mX <= this.buttonList[i].x + this.buttonList[i].w) {
                    if (this.buttonList[i].highlightOnClick) {
                        this.buttonList[i].img = this.buttonList[i].hImg;
                        this.buttonList[i].sx = this.buttonList[i].hSX;
                        this.buttonList[i].sy = this.buttonList[i].hSY;
                    }
					this.buttonList[i].click();
				}
			}
		}
	};

    this.reset = function() {
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].reset();
        }
    };

};