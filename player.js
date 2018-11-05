function Player( name ){
	
	this.nick = name;
	this.ident = 0;

	this.log = new Logger();

};
Player.prototype = {

	ident: 0,
	nick: 'gracz',
	no: 0,
	size: 15,

	pozx: 0, pozy: 0,

	lvl: 1,
	exp: 0, maxexp: 100,

	hp: 100, maxhp: 100,
	mp: 50, maxmp: 50,

	statEff: function( stat, p ){

		if( p=='-all' ){
			this[stat.toLowerCase()] = 0;
		} else if( p=='+all' ){
			this[stat.toLowerCase()] = this['max'+stat.toLowerCase()];
		} else {
			if( (p < 0 && this[stat.toLowerCase()] + p < 0) || (p > 0 && this[stat.toLowerCase()] + p > this['max'+stat.toLowerCase()]) ){
				p < 0 ? p=-this[stat.toLowerCase()] : p=this['max'+stat.toLowerCase()]-this[stat.toLowerCase()];
			}
			this[stat.toLowerCase()] += p;
		}

		//p!=0 ? this.log.fire('<'+stat.toLowerCase()+'>'+stat.toUpperCase()+' '+p+'</'+stat.toLowerCase()+'>'):false;

		System.playerStatUpdate(stat.toLowerCase(),this[stat.toLowerCase()]);
		System.playerBar(stat.toLowerCase());
	},

	addExp: function( e ){

		this.exp += e;

		var counter=0;
		while( this.exp >= this.maxexp ){
			counter++;
			this.exp -= this.maxexp;
				this.exp < 0 ? this.exp=0 : null;
			this.maxexp = Math.ceil(this.maxexp*=1.5);
		}

		System.playerStatUpdate('exp',this.exp);
		System.playerBar('exp');

		if( counter > 0 ){
			console.log('lvl +'+counter);
			this.lvlUp( counter );
		}
	},

	lvlUp: function( L ){

		this.lvl += L;
		System.playerStatUpdate('lvl',this.lvl);

		this.maxhp += 10*L;
			//this.log.fire('<up>MAX HP +'+10*L+'</up>');
		this.maxmp += 5*L;
			//this.log.fire('<up>MAX MP +'+5*L+'</up>');



		System.playerBoxUpdate( System.player );

		this.statEff('hp','+all');
		this.statEff('mp','+all');

		this.log.fire('<lvlup>LVL UP!</lvlup>');
	},
};