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

	this.gameObjectsArr = [];
	this.keyboard = [];

	this.startButton = $('<div id="startButton" style="width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;background:'+this.startImg+' #A8E1FF;">');
	this.gameFrame = $('<div id="gameFrame" style="display:none;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;">');
	this.sprite = $('<div class="sprite" style="position:absolute;overflow:hidden;"></div>');

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

	this.createTilemap = function(){
		if(this.tilemap){
			var x = 0;
			var y = 0;
			var tileWidth = this.tilemap.tiles.width;
			var tileHeight = this.tilemap.tiles.height;
			var tilemapWidth = this.tilemap.data[0].length;
			var tilemapHeight = this.tilemap.data.length;
			var tilemapFrame = $('<div class="tilemapFrame" style="position:absolute"></div>');

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
						tilemapFrame.append(tile.sprite);
						this.addGameObj(tile);
					}
				}
			}
			this.gameFrame.append(tilemapFrame)
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
		}
		if(that.keyboard[38]){
			idle = false;
		}
		if(that.keyboard[39]){
			idle = false;
		}
		if(idle){
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
		this.sprite = sprite;
		this.animation = animation;
	};

var Player = function(settings){
	this.settings = settings||{};

	this.x = this.settings.x || 0;
	this.y = this.settings.y || 0;

	this.width = this.settings.width || 74;
	this.height = this.settings.height || 93;

	this.img = this.settings.img || 'player.png';
	this.currentFrame = this.settings.currentFrame || 0;
	this.acceleration = this.settings.acceleration || 9;
	this.speed = this.settings.speed || 20;
	this.status = this.settings.status || "stand";
	this.horizontalMove = 0;

	this.sprite = new Sprite({x:this.x,y:this.y,width:this.width,height:this.height,img:this.img,currentFrame:this.currentFrame});
	this.animation = animation;
		
	this.left = function (){
	};
	
	this.right = function (){
	};
	
	this.jump  = function (){
	};
	
	this.idle  = function (){
	};
};
