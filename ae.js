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

	this.startButton = $('<div id="startButton" style="width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;background:'+this.startImg+' #A8E1FF;">');
	this.gameFrame = $('<div id="gameFrame" style="display:none;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;">');

	this.init = function(){
		$('body').append('<div id="game" style="position:relative;width:'+this.windowWidth+'px;height:'+this.windowHeight+'px;overflow:hidden;">');
		$('#game').append(this.startButton);

		this.startButton.click(function(){
			that.startGame();
		});
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

	this.startGame = function(){
		$('#game').append(this.gameFrame);

		this.startButton.remove();
		this.gameFrame.show();
	};
};
