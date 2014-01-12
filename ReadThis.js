(function ( $ ) {
	$.fn.ReadThis = function(op) 
	{
		$("head").append("<style> .hidden{ display: none !important; visibility: hidden; z-index: -1;} .derecha, .relleno, .doble, .izquierda, .single{ position: absolute; } </style>");
		
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
		this.css({
			"overflow": "hidden",
			"height": opciones.height,
			"width": opciones.width,
			"position": "absolute"
		});
		
		var OBJ = this;
		
		preCargar(this);
		this.data("porcentage", 0);
		this.data("timer", setInterval(function(){loader(OBJ);}, 200));
		
	};
	function loader(OBJ)
	{
		var largo = OBJ.data("opciones").array.length;
		if(OBJ.data("porcentage") < largo)
		{
			$("#output").text("Cargando: " + Math.round((100/largo)*OBJ.data("porcentage")) + "%");
		} else {
			$("#output").text("Carga terminada: " + 100 + "%");
			clearInterval(OBJ.data("timer"));
			if( OBJ.data("opciones").pages == "single" )
			{
				setUpSingle(OBJ);
			} else {
				setUpDoble(OBJ);
			}
		}
	}
	function preCargar(OBJ)
	{	
		var img = new Array()
		var largo = OBJ.data("opciones").array.length;
		
		for(var i = 0; i < largo; i++)
		{
			img[i] = new Image();

			$(img[i]).load(function(){
				OBJ.data("porcentage", OBJ.data("porcentage") + 1);
			}).attr({
				src: OBJ.data("opciones").array[i]
			}).error(function(){
				alert("Error! No se puede cargar una imagen! Recargar la pagina!");
			});
		}
		OBJ.data("imagenes", img);
	}
	function setUpSingle(OBJ)
	{	
		var largo = OBJ.data("opciones").array.length;
		//Y CREAR DIVS CORRESPONDIENTES
		for(var i = 0; i < largo; i++)
		{
			OBJ.append("<div id='" + i + "' class='single hidden'></div>");
			$("#" + i).append($(OBJ.data("imagenes")[i]));
		}
		$("#ReadThis").contents().first().removeClass("hidden");
		$("#ReadThis").contents().first().addClass("mostrar");
		//AJUSTAR LOS TAMAÑOS DE LAS IMAGENES Y POSICIÓN
		ajustarImagenes(OBJ);
		//CREAR LISTENERS
		crearListeners(OBJ);
	}
	function setUpDoble( OBJ )
	{
		var largo = OBJ.data("opciones").array.length;
		var primeraDoble = false, listo = false;
		var largos = new Array();
		var j = 0, k = 0;
		var doblePar = false, derecha = true, doble = false;
		
		//DETERMINAR CUALES SON PAGINAS DOBLES
		for( var i = 0; i < largo; i++ )
		{
			if( OBJ.data("imagenes")[i].width > OBJ.data("imagenes")[i].height )
			{
				largos[i] = "doble";
			} else {
				largos[i] = "normal";
			}
		}
		//CREAR DIVS CORRESPONDIENTES
		alert("LARGOS: " + largos);
		for( var i = 0; i < largo; i++ )
		{
			if(largos[i] == "doble")
			{
				doble = true;
				if((i+1)%2 == 0)
				{
					if(doblePar)
					{
						OBJ.append("<div class='relleno hidden'></div>");
					}
					doblePar = true;
				} else {
					if(!doblePar)
					{
						OBJ.append("<div class='relleno hidden'></div>");
					}
					doblePar = false;
				}
			} else {
				doble = false;
			}
			if(doble)
			{
				derecha = false;
				OBJ.append("<div id='" + i + "' class='doble hidden'></div>");
			} else if(derecha) {
				derecha = false;
				OBJ.append("<div id='" + i + "' class='derecha hidden'></div>");
			} else {
				derecha = true;
				OBJ.append("<div id='" + i + "' class='izquierda hidden'></div>");
			}
			$("#" + i).append($(OBJ.data("imagenes")[i]));
		}

		$("#ReadThis").contents().first().removeClass("hidden");
		$("#ReadThis").contents().first().addClass("mostrar");
		
		//AJUSTAR LOS TAMAÑOS DE LAS IMAGENES Y POSICIÓN
		ajustarImagenes(OBJ);
		//CREAR LISTENERS
		crearListeners(OBJ);
	}
	function ajustarImagenes( OBJ )
	{
		var aux = OBJ.contents().first();
		var i = 0;
		var auxW1, auxW2;
		var W = OBJ.data("opciones").width;
		var H = OBJ.data("opciones").height;
		var Wreal, Hreal;
		
		while( aux.length > 0 )
		{	
			if( (aux.hasClass("doble")) || (i == 0) || (aux.hasClass("single")) )
			{
				aux.contents("img").css("width", "");
				aux.contents("img").css("height", "");
				aux.contents("img").css("width", optimizarTamano(W, H, OBJ.data("imagenes")[i].width, OBJ.data("imagenes")[i].height));
				i++;
			} else if( (aux.hasClass("izquierda")) ){
				aux.contents("img").css("width", "");
				aux.contents("img").css("height", "");
				auxW1 = optimizarTamano(W, H, OBJ.data("imagenes")[i].width, OBJ.data("imagenes")[i].height);
				if( aux.next().hasClass("relleno") )
				{
					aux.next().css("width", W/2);
					aux.next().css("height", H);
					auxW2 = auxW1;
				} else {
					if( aux.next().length > 0 )
					{
						aux.next().contents("img").css("width", "");
						aux.next().contents("img").css("height", "");
						auxW2 = optimizarTamano(W, H, OBJ.data("imagenes")[i+1].width, OBJ.data("imagenes")[i+1].height);
						i++;
					} else {
						auxW2 = 0;
					}
				}
				if( auxW1+auxW2 > W )
				{
					auxW1 = W/2;
					auxW2 = W/2;
				}
				aux.contents("img").css("width", auxW1);
				aux.next().contents("img").css("width", auxW2);
				
				i++;
			}
			aux = aux.next();
		}
		//CENTRAR EN EL LADO CORRESPONDIENTE
		OBJ.contents().each(function(){

			if( $(this).hasClass("izquierda") ) {
				$(this).css({
					"right": W/2,
					//"top": (H-$(this).contents("img").height())/2
				});
			} else if( $(this).hasClass("derecha") || $(this).hasClass("relleno") ) {
				$(this).css({
					"left": W/2,
					//"top": (H-$(this).contents("img").height())/2
				});
			} else if( $(this).hasClass("doble") || OBJ.data("opciones").pages == "single" ) {
				$(this).css({
					"left": (W-$(this).contents("img").width())/2,
					//"top": (H-$(this).contents("img").height())/2
				});
			}
		});
	}
	function optimizarTamano( W, H, iW, iH )
	{
		if( iH > H )
		{
			if( H*iW/iH > W )
			{
				return W;
			} else {
				return Math.round(H*iW/iH);
			}
		} else {
			if( iW > W )
			{
				return W;
			} else {
				return iW;
			}
		}
	}
	function crearListeners(OBJ)
	{
		OBJ.click(function(e) {
			if(e.pageX >= (OBJ.width()/2))
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
			if( dir == "right" && (this.contents(".mostrar").attr("id") != ultimo) )
			{
				this.contents(".mostrar").next().addClass("proximo");
				this.contents(".mostrar").addClass("hidden"); 
				this.contents(".mostrar").removeClass("mostrar");
				this.contents(".proximo").addClass("mostrar");
				this.contents(".proximo").removeClass("hidden"); 
				this.contents(".proximo").removeClass("proximo");
			} else if( dir == "left" && (this.contents(".mostrar").attr("id") != 0) ) {
				this.contents(".mostrar").prev().addClass("proximo");
				this.contents(".mostrar").addClass("hidden"); 
				this.contents(".mostrar").removeClass("mostrar");
				this.contents(".proximo").addClass("mostrar");
				this.contents(".proximo").removeClass("hidden"); 
				this.contents(".proximo").removeClass("proximo");
			}
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
			} else if( dir == "left" && (this.contents(".mostrar").first().attr("id") != 0) && !(this.contents(".mostrar").first().hasClass("relleno")) ) {
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
	$.fn.ReadThisFullscreen = function()
	{
		this.fullscreen();
		this.data("swapW", this.data("opciones").width);
		this.data("swapH", this.data("opciones").height);
		
		this.data("opciones").width = $(window).width();
		this.data("opciones").height = $(window).height();
		
		ajustarImagenes(this);
		
	}
}( jQuery ));