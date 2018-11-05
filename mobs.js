function Mob( level ){

	this.lvl = level;
	this.spawn();
	
};
Mob.prototype = {

	pozx: 0, pozy: 0,
	lvl: 1,
	hp: 10,
	exp: 10,
	dead: false,
	color: 'rgb(200,0,20)',

	ctx: null,

	spawn: function(){

		this.hp = this.lvl*10;
		this.exp = this.hp;

		this.rand();
	},

	rand: function(){

		var r,g,b;

		setTimeout(function(){
			this.pozx = Math.ceil((window.innerWidth-100)*Math.random());
		}.bind(this),0);

		setTimeout(function(){
			this.pozy = Math.ceil((window.innerHeight-100)*Math.random());
		}.bind(this),1);

		setTimeout(function(){
			r = Math.ceil(200*Math.random());
		}.bind(this),2);
		setTimeout(function(){
			g = Math.ceil(200*Math.random());
		}.bind(this),3);
		setTimeout(function(){
			b = Math.ceil(200*Math.random());
		}.bind(this),4);

		setTimeout(function(){
			this.color = 'rgb('+ r +','+ g +','+ b +')';
		}.bind(this),4);

		setTimeout(function(){
			this.drawMob();
		}.bind(this),5);		
	},

	drawMob: function(){

			System.mobctx.fillStyle = ( !this.dead ? this.color : 'rgb(255,255,255)' );
			System.mobctx.strokeStyle = 'black';
			System.mobctx.lineWidth = 1;
		System.mobctx.beginPath();
		System.mobctx.arc(this.pozx, this.pozy, this.hp, (Math.PI/180)*0, (Math.PI/180)*360, false);
		System.mobctx.closePath();
		System.mobctx.fill();
		!this.dead ? System.mobctx.stroke() : null;
	},

	damage: function( p ){

		this.hp -= p;
	},

};