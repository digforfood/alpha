var AE = function(){
	var that = this;
	this.JSONDATA = 'jsondata';
	this.JSONURL = 'jsonurl';

	this.imgDir = '';
	this.startImg = '';
	this.baseRate = 30;
	this.windowWidth = 640;
	this.windowHeight = 480;
	this.keyboardEvents = true;
	this.tilemap = false;

	this.playerObj = null;
	this.gameObjectsArr = [];
	this.keyboard = [];

	this.startButton = $('<div id="startButton" style="width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;background:'+this.startImg+' #A8E1FF;">');
	this.gameFrame = $('<div id="gameFrame" style="display:none;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;">');

	this.addGameObj = function(obj){
		this.gameObjectsArr.push(obj);
	};

	this.setImgDir = function(value){
		this.imgDir = value +'/';
	};

	this.setStartImg = function(value){
		this.startImg = 'url('+ this.imgDir + value +')';
	};

	this.setBaseRate = function(value){
		this.baseRate = value;
	};

	this.setWindowWidth = function(value){
		this.windowWidth = value;
	};

	this.setWindowHeight = function(value){
		this.windowHeight = value;
	};

	this.setPlayerObj = function(value){
		this.playerObj = value;
	};

	this.setKeyboardEvents = function(value){
		this.keyboardEvents = value;
	};

	this.setTilemap = function(data,type){
		if(type == this.JSONDATA){
			this.tilemap = data;
		}else if(type == this.JSONURL){
			$.ajax({
				url: data,
				async: false,
				dataType: 'json',
				success: function(json){
					this.tilemap = json;
				}
			});
		}
	};

	this.createGameFrame = function(){
		var gameObjectsFrame = $('<div class="gameObjectsFrame" style="position:absolute"></div>');
		var tilemapFrame = $('<div class="tilemapFrame" style="position:absolute"></div>');
		for(var i = 0;i < this.gameObjectsArr.length;i++){
			if(this.gameObjectsArr[i].class == 'tile'){
				tilemapFrame.append(this.gameObjectsArr[i].sprite);
			}else if(this.gameObjectsArr[i].class == 'player'){
				gameObjectsFrame.append(this.gameObjectsArr[i].sprite);
			}
		}
		gameObjectsFrame.append(tilemapFrame);
		this.gameFrame.append(gameObjectsFrame);
	};

	this.createTilemap = function(){
		if(this.tilemap){
			var x = 0;
			var y = 0;
			var tileWidth = this.tilemap.tiles.width;
			var tileHeight = this.tilemap.tiles.height;
			var tilemapWidth = this.tilemap.data[0].length;
			var tilemapHeight = this.tilemap.data.length;

			for(var i=0; i < tilemapHeight; i++){
				for(var j=0; j < tilemapWidth; j++){
					var tileType = this.tilemap.data[i][j];
					if(tileType > 0){
						var options = {
							x: x + j*tileWidth,
							y: y + i*tileHeight,
							width: tileWidth,
							height: tileHeight,
							img: this.imgDir+this.tilemap.tiles.url,
							currentFrame: tileType
						};
						
						var animation = {};
						var tile = new Tiles(options,animation);
						this.addGameObj(tile);
					}
				}
			}
		}
	};

	this.keyboardEventsEnable = function(){
		$(document).keydown(function(event){
			that.keyboard[event.keyCode] = true;
		});
		$(document).keyup(function(event){
			that.keyboard[event.keyCode] = false;
		});
	};

	this.init = function(){
		this.createTilemap();
		this.createGameFrame();

		$('body').append('<div id="game" style="position:relative;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;overflow:hidden;">');
		$('#game').append(this.startButton);

		if(this.keyboardEvents){
			this.keyboardEventsEnable();
		}

		this.startButton.click(function(){
			that.startGame();
		});
	};

	this.startGame = function(){

		setInterval(this.gameLoop, this.baseRate);

		$('#game').append(this.gameFrame);
		this.startButton.remove();
		this.gameFrame.show();
	};

	this.gameLoop = function(){
		var idle = true;
		if(that.keyboard[37]){
			idle = false;
			that.playerObj.left();
		}
		if(that.keyboard[39]){
			idle = false;
			that.playerObj.right();
		}
		if(that.keyboard[38]){
			idle = false;
			that.playerObj.up();
		}
		if(idle){
		}

		for(var i = 0;i < that.gameObjectsArr.length;i++){
			that.gameObjectsArr[i].update();
		}
		for(var i = 0;i < that.gameObjectsArr.length;i++){
			that.gameObjectsArr[i].sprite.css({
				left: that.gameObjectsArr[i].x,
				top: that.gameObjectsArr[i].y,
			});
		}
	};
	
};

var Sprite = function(settings){
	this.settings = settings||{};
	this.currentFrame = this.settings.currentFrame || 1;
	this.x = this.settings.x || 0;
	this.y = this.settings.y || 0;
	this.width = this.settings.width || 70;
	this.height = this.settings.height || 70;
	this.img = this.settings.img || '';
	this.sprite = $('<div class="sprite" style="position:absolute;overflow:hidden;"></div>');
	this.sprite.css({
		left: this.x,
		top: this.y,
		width: this.width,
		height: this.height,
		backgroundImage: 'url('+this.img+')',
		backgroundPosition: '-' +(this.currentFrame-1)*this.width + 'px 0px'}
	);

	return this.sprite;
};

var Tiles = function(settings,animation){
	this.class = 'tile';
	this.settings = settings||{};

	this.x = this.settings.x || 0;
	this.y = this.settings.y || 0;

	this.width = this.settings.width || 70;
	this.height = this.settings.height || 70;

	this.img = this.settings.img || '';
	this.currentFrame = this.settings.currentFrame || 1;

	this.sprite = new Sprite({x:this.x,y:this.y,width:this.width,height:this.height,img:this.img,currentFrame:this.currentFrame});
	this.sprite.data("AE", this.settings);
	this.animation = animation;

	this.update = function(){
	};
};

var Player = function(settings){
	this.class = 'player';
	this.settings = settings||{};
	this.gameObjectsArr;

	this.x = this.settings.x || 0;
	this.y = this.settings.y || 0;

	this.width = this.settings.width || 74;
	this.height = this.settings.height || 93;

	this.img = '';
	this.currentFrame = this.settings.currentFrame || 1;
	this.acceleration = this.settings.acceleration || 2;
	this.status = this.settings.status || "stand";
	this.xVelocity = 0;
	this.yVelocity = 0;

	this.sprite = new Sprite({x:this.x,y:this.y,width:this.width,height:this.height,img:this.img,currentFrame:this.currentFrame});
	this.animation = this.settings.animation||{};

	this.setGameObjectsArr = function(value){
		this.gameObjectsArr = value;
	};

	this.setSpriteImg = function(value){
		this.img = value;
		this.sprite.css({
			backgroundImage: 'url('+this.img+')'
		});
	};

	this.intersect = function(a1,a2,b1,b2){
		return [ Math.min(Math.max(a1, b1), a2), Math.max(Math.min(a2, b2), a1)];
	} 

	this.update = function(){
		this.yVelocity += this.acceleration;
		this.x += this.xVelocity;
		this.y += this.yVelocity;

		var centerX = this.x + this.width/2;
		var centerY = this.y + this.height/2;

		var collisions = [];

		for (var i = 0; i < this.gameObjectsArr.length; i++) {
			var gameObject = this.gameObjectsArr[i];

			var spriteCenterX = gameObject.x + gameObject.width/2;
			var spriteCenterY = gameObject.y + gameObject.height/2;
			
			if( !(gameObject.x == this.x && gameObject.y == this.y) ){
				if( ((this.width/2 + gameObject.width/2) > Math.abs(centerX-spriteCenterX)) && ((this.height/2 + gameObject.height/2) > Math.abs(centerY-spriteCenterY)) ){
					collisions.push(gameObject);
				}
			}
		}

		for (var i = 0; i < collisions.length; i++) {
			var gameObject = collisions[i];

			var intersectX = this.intersect(this.x, this.x + this.width, gameObject.x, gameObject.x + gameObject.width);
			var intersectY = this.intersect(this.y, this.y + this.height, gameObject.y, gameObject.y + gameObject.height);
			
			var differenceX = (intersectX[0] === this.x)? intersectX[0]-intersectX[1] : intersectX[1]-intersectX[0];
			var differenceY = (intersectY[0] === this.y)? intersectY[0]-intersectY[1] : intersectY[1]-intersectY[0];
			
			if (Math.abs(differenceX) > Math.abs(differenceY)){
				this.y -= differenceY;
				this.yVelocity = 0;
			} else {
				this.x -= differenceX;
			}
		}
		
		this.xVelocity = 0;
	};

	this.left = function(){
		this.xVelocity -= 7;
	};

	this.right = function(){
		this.xVelocity += 7;
	};

	this.up = function(){
		this.yVelocity = -20;
	};

	this.idle = function(){
	};
};
