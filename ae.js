var AE = function(settings){
	var that = this;
	this.JSONDATA = 'jsondata';
	this.JSONURL = 'jsonurl';
	this.settings = settings||{};

	this.imgDir = (this.settings.imgDir) ? this.settings.imgDir+'/' : '';
	this.startImg = (this.settings.startImg) ? 'url('+this.imgDir+this.settings.startImg+')' : '';
	this.baseRate = this.settings.baseRate || 30;
	this.windowWidth = this.settings.windowWidth || 640;
	this.windowHeight = this.settings.windowHeight || 480;
	this.tilemap = false;

	this.gameObjectsArr = [];

	this.startButton = $('<div id="startButton" style="width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;background:'+this.startImg+' #A8E1FF;">');
	this.gameFrame = $('<div id="gameFrame" style="display:none;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;">');
	this.sprite = $('<div class="sprite" style="position:absolute;overflow:hidden;"></div>');

	this.init = function(){

		this.createTilemap();

		$('body').append('<div id="game" style="position:relative;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;overflow:hidden;">');
		$('#game').append(this.startButton);

		this.startButton.click(function(){
			that.startGame();
		});
	};

	this.Tiles = function(sprite,animation){
		this.sprite = sprite;
		this.animation = animation;
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
					if(this.tilemap.data[i][j] > 0){
						var options = {
							x: x + j*tileWidth,
							y: y + i*tileHeight,
							width: tileWidth,
							height: tileHeight
						};

						var sprite = this.sprite.clone().css({
							left: options.x,
							top: options.y,
							width: options.width,
							height: options.height}
						).addClass("row_"+i).addClass("cell_"+j).data("AE", options);
						
						var animation = {};
						var tile = new this.Tiles(sprite,animation);
						tilemapFrame.append(tile.sprite)
						this.gameObjectsArr.push(tile);
					}
				}
			}
			this.gameFrame.append(tilemapFrame)
		}
	};

	this.startGame = function(){
		$('#game').append(this.gameFrame);

		this.startButton.remove();
		this.gameFrame.show();
	};
};
