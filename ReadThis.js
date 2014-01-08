(function ( $ ) {
	$.fn.ReadThis = function(op) 
	{
		var opciones = $.extend({
			//default
			height:400, 
			width:800,
			backround-color:'#000',
			pages: "single",
			navegation: false,
		}, op);
		this.data("opciones", opciones);
		//CREAR DIVS DE LAS IMAGENES
		if(op.array != undefined)
		{
			var largo = opciones.array.length
			for(var i = 0; i < largo; i++)
			{
				this.append("<div id='" + i + "'><img src=''></img></div>");
			}
		}
		//FONDO
		if(opciones.backround-img == undefined)
		{
			this.css("background", opciones.background-color);
		}		
	};
}( jQuery ));