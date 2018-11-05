$(window).load(function(){ 
	logHistory = [];
	attack = false;
	magic = false;
	pause = false;
	
	mobs = [];

	console.log('DOM ready');
	System.initialize();







	if( $('#reklamacba') ){ $('#reklamacba').remove(); }
});

var System = {

	player: null,

	initialize: function(){

		this.playerAdd( 'jacek' );
		this.canvasSet();
		this.observe();




		System.mobsGenerate();
	},

	playerAdd: function( name ){

		this.player = new Player( name );

		this.playerBoxBuild( this.player );
		this.playerBoxUpdate( this.player );
	},

	playerBoxBuild: function( p ){

		var hud = $('#playerHUD');
		var blank = $('#player_blank');

		blank.clone().attr('id','player_'+p.ident).attr('nick',p.nick).appendTo( hud ).show();
	},

	playerBoxRemove: function( id ){

		$('#player_'+id).remove();
	},

	playerStatUpdate: function( id, val ){

		$('#player_'+this.player.ident).find('li.'+id+'> span.var')[0].innerHTML = this.player[id];
		if( this.player['max'+id] ){
			$('#player_'+this.player.ident).find('li.'+id+'> span.maxvar')[0].innerHTML = this.player['max'+id];
		}
	},

	playerBoxUpdate: function( p ){

		var one = $('#player_'+p.ident);
			one.find('li.icon')[0].innerHTML = p.nick.toUpperCase();
			this.playerStatUpdate( 'lvl', p.lvl );
			this.playerStatUpdate( 'exp', p.exp );
			System.playerBar('exp');
			this.playerStatUpdate( 'hp', p.hp );
			System.playerBar('hp');
			this.playerStatUpdate( 'mp', p.mp );
			System.playerBar('mp');
	},

	playerBar: function( name ){

		var one = $('#player_'+this.player.ident);
		var width = this.player[name]==0 ? 0 : (this.player[name]/this.player['max'+name])*100+'%';
			one.find('li.'+name+'> div.bar').animate({'width':width},100);
	},

	canvasSet: function(){

		this.canvas = $('#pcanvas')[0];
		this.ctx = this.canvas.getContext('2d');

		this.mobcanvas = $('#mobcanvas')[0];
		this.mobctx = this.mobcanvas.getContext('2d');

		this.windowResize();

		return this;
	},

	canvasDraw: function(){

		var p = System.player;

		if( magic ){ 
			this.ctx.strokeStyle = 'rgba(0,0,255,0.6)';
			this.ctx.lineWidth = 50;
		} else {
			this.ctx.strokeStyle = 'rgba(255,0,0,0.9)';
			this.ctx.lineWidth = 8;
		}

		this.ctx.fillStyle = 'orange';
		this.ctx.beginPath();
		this.ctx.arc(p.pozx, p.pozy, p.size, (Math.PI/180)*0, (Math.PI/180)*360, false);
		this.ctx.closePath();
			attack ? this.ctx.stroke() : null ;
		this.ctx.fill();
	},

	redraw: function(){
		this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		this.canvasDraw();
	},

	mobsRedraw: function(){

		System.mobctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		$.each( mobs, function( index, m ){
			m.drawMob();
		}.bind(this));
	},

	pause: function( e ){

		//32 = spacja
		if( pause && e.keyCode==32 ){
			$('body').css('cursor','none');
			pause = false;
			$('#pauseMask').hide();
		} else if( e.keyCode==32 ) { //PAUZA
			$('body').css('cursor','default');
			pause = true;
			$('#pauseMask').show();
		}
	},

	mobsGenerate: function(){

		setInterval(function(){
			this.mobAdd({keyCode:77});
		}.bind(this), Math.ceil(1000+ (9000*Math.random())) );
	},

	moveMouse: function( e ){

		if( !pause ){
			System.player.pozx = e.x;
			System.player.pozy = e.y;
			this.redraw();
			this.mobsRedraw();
		}
	},

	mobAdd: function( e ){

		if( e.keyCode == 77 ){
			var r = Math.random();
			var mob = new Mob( Math.ceil(5*r) );
			window.mobs.length > 9 ? window.mobs.shift() : null;
			window.mobs.push( mob );

			window.mobs.length == 1 ? this.observeMobs() : null;
		}
	},

	playerKeydown: function( e ){

		if( e.keyCode==16 ){ //shift
			magic = true;
		}
	},
	playerKeyup: function( e ){

		if( e.keyCode==16 ){
			magic = false;
		}
	},
	playerActive: function(){

		if( magic && (System.player.mp >= 10) && (System.player.hp < System.player.maxhp) ){
			System.player.statEff('hp',10);
			System.player.statEff('mp',-10);
			System.player.log.fire('SELF HEAL 10');
		}

		attack = true;
		this.redraw();
	},
	playerInActive: function(){

		attack = false;
		this.redraw();
	},

	windowResize: function(){

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.mobcanvas.width = window.innerWidth;
		this.mobcanvas.height = window.innerHeight;

		this.redraw();

		$.each( mobs, function( index, el ){
			mobs[index].drawMob();
		}.bind(this));
	},

	observe: function(){

		window.addEventListener('mousemove',System.moveMouse.bind(System),false);
		window.addEventListener('keyup',System.pause.bind(System),false);

		window.addEventListener('mousedown',System.playerActive.bind(System),false);
		window.addEventListener('keydown',System.playerKeydown.bind(System),false);
		window.addEventListener('keyup',System.playerKeyup.bind(System),false);
		window.addEventListener('mouseup',System.playerInActive.bind(System),false);

		window.addEventListener('keyup',System.mobAdd.bind(System),false);

		window.addEventListener('resize',System.windowResize.bind(System),false);
	},

	observeMobs: function(){

		window.addEventListener('mousemove',System.playerEncounter.bind(System),false);
	},






	//WALKA

	playerEncounter: function(){

		var p = System.player;
		if( attack ){
			$.each( mobs, function( index, m ){
				if( (p.pozx > m.pozx-m.hp) && (p.pozx < m.pozx+m.hp) && (p.pozy > m.pozy-m.hp) && (p.pozy < m.pozy+m.hp) ){
					if( m.hp > p.size ){ m.damage(1); p.statEff('mp',1); }
					else if(!m.dead) { p.addExp(m.exp); m.dead = true; }
					System.mobsRedraw();
				}
			}.bind(this));
		} else {
			$.each( mobs, function( index, m ){
				if( (p.pozx > m.pozx-m.hp) && (p.pozx < m.pozx+m.hp) && (p.pozy > m.pozy-m.hp) && (p.pozy < m.pozy+m.hp) ){
					if( m.hp > p.size ){ p.statEff('hp',-m.lvl); System.redraw(); }
					else {  }
				}
			}.bind(this));
		}
	},
};

