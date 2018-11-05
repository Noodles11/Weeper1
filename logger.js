function Logger(){

	this.fire = function( message, hide ){

		var date = new Date();
		logHistory.push( [false,message,date.getTime()] ); //boolean - shown

		!hide ? this.showLog() : (logHistory[logHistory.length-1][0]=true) ;
	}
	this.showLog = function(){

		var ind = 0;
		$.each( logHistory, function( i, el ){
		    if( !el[0] ){
		    	var a = setTimeout( function(){
		    		this.popup( Math.floor(Math.random()*el[2]), el[1], 0, 1000 ); el[0]=true;
		    	}.bind(this),( ind*1600 ));
		    	ind++;
		    }
		}.bind(this));
	}

	this.shownow = function( message ){ 

		console.log( 'LOG: '+message );
	}

	this.popup = function( i, message, delay, time ){

		var pop = document.createElement('div');
		pop.innerHTML = message;
		pop.className = 'ev';
		pop.id = 'ev_'+i;
		$('#popup').show();
		$('#popup')[0].appendChild(pop);

		var start = window.setTimeout(function(){ //wjazd
			$('#ev_'+i).animate({top:'50px',opacity:1},200);
		},delay);
		var mv = window.setTimeout(function(){ //w gore
			$('#ev_'+i).animate({top:'10px'},time);
		},(delay+time));
		var stop = window.setTimeout(function(){ //znika
			$('#ev_'+i).animate({top:'-100px',opacity:0},time,function(){this.remove();});
		},(delay+time*2));

		return this;
	}
	this.popdown = function( message, key ){

		$('#popup')[0].innerHTML = '<div>'+message+'</div>';

		$('#popup').fadeIn('fast');

		window.addEventListener('keydown', function( event ){
			if( event.which==key ){
				window.removeEventListener('keydown', this, false);
				$('#popup').fadeOut('fast');
				$('#popup')[0].innerHTML = '';
			}
		}, false);

		return this;
	}
}

Logger.prototype = {

	history: [],

	showIt: function(){

		$.each( this.history, function( index, el ){
			console.log(el[1]);
		}.bind(this));
	},
}