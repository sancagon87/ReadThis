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
		this.css("overflow", "hidden");
		this.css("height",opciones.height);
		this.css("width",opciones.width);
		if(opciones.pages == "single")
		{	
			alert("single");
			setUpSingle(this);
		} else {
			alert("doble");
			setUpDoble(this);
		}
	};
	function setUpSingle(OBJ)
	{	
		var imagenes = new Array();
		
		//GUARDAR IMAGENES COMO OBJETOS Image
		//Y CREAR DIVS CORRESPONDIENTES
		for(var i = 0; i < largo; i++)
		{
			imagenes[i] = new Image();
			imagenes[i].src = OBJ.data("opciones").array[i];
			OBJ.append("<div id='" + i + "'><img src=''></img></div>");
		}
		OBJ.data("imagenes", imagenes);
		//CREAR LISTENERS
		crearListeners(OBJ);
	}
	function setUpDoble(OBJ)
	{
		var largo = OBJ.data("opciones").array.length;
		var imagenes = new Array();
		var primeraDoble = false, listo = false;
		var largos = new Array();
		var largoB = new Array();
		var j = 0, k = 0;
		
		//GUARDAR IMAGENES COMO OBJETOS Image
		for(var i = 0; i < largo; i++)
		{
			imagenes[i] = new Image();
			imagenes[i].src = OBJ.data("opciones").array[i];
		}
		OBJ.data("imagenes", imagenes);
		
		var doblePar = false, derecha = true, doble = false;
		
		//DETERMINAR CUALES SON PAGINAS DOBLES
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
				//CREAR DIVS CORRESPONDIENTES
				alert("LARGOS: " + largos);
				for(var h = 0; h < largo; h++)
				{	
					if( h == 0 )
					{
						if(primeraDoble)
						{
							meterRelleno(OBJ);
							doble = true;
						}
					} else {
						if(largos[h] == "doble")
						{
							doble = true;
							if((h+1)%2 == 0)
							{
								if(doblePar)
								{
									meterRelleno(OBJ);
								}
								doblePar = true;
							} else {
								if(!doblePar)
								{
									meterRelleno(OBJ);
								}
								doblePar = false;
							}
						} else {
							doble = false;
						}
					}
					if(doble)
					{
						derecha = false;
						OBJ.append("<div id='" + h + "' class='doble hidden'><img src=''></img></div>");
					} else if(derecha) {
						derecha = false;
						OBJ.append("<div id='" + h + "' class='derecha hidden'><img src=''></img></div>");
					} else {
						derecha = true;
						OBJ.append("<div id='" + h + "' class='izquierda hidden'><img src=''></img></div>");
					}
				}
			}
		}
		$("#ReadThis").contents().first().removeClass("hidden");
		$("#ReadThis").contents().first().addClass("mostrar");
		//CREAR LISTENERS
		crearListeners(OBJ);
	}
	function meterRelleno(OBJ)
	{
		OBJ.append("<div class='relleno hidden'></div>");
	}
	function crearListeners(OBJ)
	{
		OBJ.click(function(e) {
			if(e.pageX >= ($(document).width()/2))
			{
				OBJ.flipPage("right");
			} else {
				OBJ.flipPage("left");
			}
		});
	}
	$.fn.flipPage = function(dir)
	{
		var ultimo = this.data("opciones").array.length - 1;
		
		if(this.data("opciones").pages == "single")
		{
			
		} else {
			if( dir == "right" && (this.contents(".mostrar").last().attr("id") != ultimo) )
			{
				this.contents(".mostrar").last().next().addClass("proximo");
				if( !this.contents(".mostrar").last().next().hasClass("doble") )
				{
					this.contents(".proximo").next().addClass("proximo");
				}
				this.contents(".mostrar").each(function(){$(this).addClass("hidden"); $(this).removeClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).addClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).removeClass("hidden"); $(this).removeClass("proximo");});
			} else if( dir == "left" && (this.contents(".mostrar").first().attr("id") != 0) ) {
				this.contents(".mostrar").first().prev().addClass("proximo");
				if( !this.contents(".mostrar").first().prev().hasClass("doble") )
				{
					this.contents(".proximo").prev().addClass("proximo");
				}
				this.contents(".mostrar").each(function(){$(this).addClass("hidden"); $(this).removeClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).addClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).removeClass("hidden"); $(this).removeClass("proximo");});
			}
		}
	};
}( jQuery ));


