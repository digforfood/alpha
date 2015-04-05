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

						var sprite = new Sprite(options);
						sprite.addClass("row_"+i).addClass("cell_"+j).data("AE", options);
						
						var animation = {};
						var tile = new Tiles(sprite,animation);
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

var Tiles = function(sprite,animation){
	this.class = 'tile';
	this.sprite = sprite;
	this.animation = animation;

	this.update = function(){
	};
};

var Player = function(settings){
	this.class = 'player';
	this.settings = settings||{};

	this.x = this.settings.x || 0;
	this.y = this.settings.y || 0;

	this.width = this.settings.width || 74;
	this.height = this.settings.height || 93;

	this.img = this.settings.img || 'player.png';
	this.currentFrame = this.settings.currentFrame || 0;
	this.acceleration = this.settings.acceleration || 9;
	this.status = this.settings.status || "stand";
	this.xVelocity = 0;
	this.yVelocity = 0;

	this.sprite = new Sprite({x:this.x,y:this.y,width:this.width,height:this.height,img:this.img,currentFrame:this.currentFrame});
	this.animation = this.settings.animation||{};

	this.update = function(){
		this.x += this.xVelocity;
		this.y += this.yVelocity;
		
		this.yVelocity += this.acceleration;
		this.xVelocity = 0;
	};

	this.left = function(){
		this.xVelocity -= 7;
	};

	this.right = function(){
		this.xVelocity += 7;
	};

	this.up = function(){
	};

	this.idle = function(){
	};
};
