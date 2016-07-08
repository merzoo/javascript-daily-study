//篮球基类
var Basketball = function(){
	this.intro = '篮球是美国的';
}
Basketball.prototype = {
	getMember : function(){
		console.log('5名队员')
	},
	getBallSize : function(){
		console.log('篮球很大')
	}
}
//足球基类
var FootBall = function(){
	this.intro = '足球是世界的';
}
FootBall.prototype = {
	getMember : function(){
		console.log('11名队员')
	},
	getBallSize : function(){
		console.log('足球很大')
	}
}
//网球基类
var Tennis = function(){
	this.intro = '网球是日本的';
}
Tennis.prototype = {
	getMember : function(){
		console.log('1名队员')
	},
	getBallSize : function(){
		console.log('网球很小')
	}
}
//运动工厂
var SprotFactory = function(name){
	switch(name){
		case 'NBA':
			return new Basketball();
		case 'worldCup':
			return new FootBall();
		case 'FrenchOpen':
			return new Tennis();
	}	
}




var footnall = SprotFactory('worldCup');
console.log(footnall);
console.log(footnall.intro);
footnall.getMember();



function createBook(name, time, type){
	var o = new Object();
	o.name = name;
	o.time = time;
	o.type = type;
	o.getName = function(){
		console.log(this.name);
	};
	return o;
}
var book1 = createBook("JS BOOk", 2014, "JS");
book1.getName();

function createPop(type, text){
	var o = new Object();
	o.content = text;
	o.show = function(){
		alert
	};
	switch(type){
		case 'alert':
			
	}
}