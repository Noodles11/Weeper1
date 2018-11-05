function Btn(){

	this.make();
}

Btn.prototype = {

	inner: 'ok',
	id: 'btn',
	width: 'auto',
	height: 'auto',
	margin: '5px',
	padding: '8px',
	position: 'relative',
	container: 'body',
	fsize: '12px',
	round: '5px',
	bgcolor: 'rgba(150,150,150,1)',
	bgcolorhover: 'rgba(200,200,200,1)',
	fcolor: 'rgba(0,0,0,1)',
	fcolorhover: 'rgba(0,0,0,1)',

	action: null,
	cursor: 'pointer',

	make: function(){

		this.div = document.createElement('div');
		$(this.container)[0].appendChild( this.div );
		
		this.div.id = this.id;
		this.div.innerHTML = this.inner;

			var class_arr = [
				['width',this.width],
				['height',this.height],
				['backgroundColor',this.bgcolor],
				['color',this.fcolor],
				['padding',this.padding],
				['margin',this.margin],
				['fontSize',this.fsize],
				['borderRadius',this.round],
				['position',this.position],
				['cursor','inherit']
			];
		this.cssStyle( class_arr );

		this.hoverMake();	
	},

	hoverMake: function(){

		this.div.hover(function(){
			console.log('siema');
		}.bind(this));

		$('#'+this.id).hover(function(){

			console.log('over');

			this.cssStyle([
				['backgroundColor',this.bgcolorhover],
				['color',this.fcolorhover],
				['cursor',this.cursor]
			]);

		}.bind(this),function(){

			this.cssStyle([
				['backgroundColor',this.bgcolor],
				['color',this.fcolor],
				['cursor','inherit']
			]);

		}.bind(this));
	},

	cssStyle: function( arg ){

		$.each( arg, function( i,e ){
			$('#'+this.id).css(e[0],e[1]);
		}.bind(this));
	}
};