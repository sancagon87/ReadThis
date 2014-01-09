(function ( $ ) {
	$.fn.ReadThis = function(op) 
	{
		var opciones = $.extend({
			//default
			height:400, 
			width:800,
			backround_color:'#000',
			pages: "single",
			navegation: false,
		}, op);
		this.data("opciones", opciones);
		//FONDO
		if(opciones.backround_img == undefined)
		{
			this.css("background", opciones.background_color);
		}
		setUp(this);
	};
	
	function setUp(OBJ)
	{

		var largo = OBJ.data("opciones").array.length;
		var imagenes = new Array();
		var primeraDoble = false, listo = false;
		var largos = new Array();
		var largoB = new Array();
		var j = 0, k = 0;
		
		for(var i = 0; i < largo; i++)
		{
			imagenes[i] = new Image();
			imagenes[i].src = OBJ.data("opciones").array[i];
		}
		
		var doblePar = false;
		
		for(var i = 0; i < largo; i++)
		{
			if(i == 0)
			{
				//alert("primero: " + imagenes[i].width);
				largos[i] = "normal";
			} else {
				if(imagenes[i].width > (imagenes[0].width)*1.2)
				{
						//alert("mayor: " + imagenes[i].width + "que: " + (imagenes[0].width)*1.2);
						largos[i] = "doble";
				} else if(imagenes[i].width*1.2 < imagenes[0].width){
					largos[i] = "normal";
					largos[0] = "doble";
					primeraDoble = true;
				} else {
					//alert("igual: " + imagenes[i].width);
					if(primeraDoble)
					{
						largos[i] = "doble";
					} else {
						largos[i] = "normal";
					}
				}
			}	
			if(i == largo-1)
			{
				alert("LARGOS: " + largos);
				for(var h = 0; h < largo; h++)
				{	
					if( h == 0 )
					{
						if(primeraDoble)
						{
							meterRelleno(OBJ);
						}
					} else {
						if(largos[h] == "doble")
						{
							if(h%2 == 0)
							{
								if(!doblePar)
								{
									meterRelleno(OBJ);
									doblePar = true;
								}
							} else {
								if(doblePar)
								{
									meterRelleno(OBJ);
									doblePar = false;
								}
							}
						}
					}
					OBJ.append("<div id='" + h + "'><img src=''></img></div>");
				}
			}
		}
	}
	function meterRelleno(OBJ)
	{
		OBJ.append("<div class='relleno'></div>");
	}
}( jQuery ));


