(function ( $ ) {
	$.fn.ReadThis = function(op) 
	{
		var loadingURL = "http://www.factormetal.com/wp-content/plugins/google-calendar-widget/loading.gif";
		var rellenoURL = "img/relleno_tile.jpg";
		$("head").append("<style> .hidden{ display: none !important; visibility: hidden; z-index: -1;} .derecha, .relleno, .doble, .izquierda, .single{ position: absolute; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;} img{-moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;} .relleno{background-image:url('" + rellenoURL + "'); background.size:100%;}</style>");
		
		var opciones = $.extend({
			//default
			height:400, 
			width:800,
			backround_color:'#000',
			pages: "single",
			navegation: false,
		}, op);
		this.data("opciones", opciones);
		this.data("fullscreen", false);
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
		
		//loading display
		this.append("<div id='ReadThisLoader' style='position:absolute; background-color:#000;'><div id='RTLoutput'><p style='color:white; text-align:center; font-size: 20px; font-weight: bold;'></p><img src='" + loadingURL + "'></img></div></div>");
		setUpLoader(this);
		this.data("porcentage", 0);
		this.data("timer", setInterval(function(){loader(OBJ);}, 200));
		
	};
	function setUpLoader(OBJ)
	{
		$("#ReadThisLoader").css({
			"width": OBJ.data("opciones").width,
			"height": OBJ.data("opciones").height
		});
		$("#RTLoutput").css("margin-top", (OBJ.data("opciones").height - 128)/2);
		$("#RTLoutput img").css({
			"margin-left": (OBJ.data("opciones").width - $("#RTLoutput img").width())/2
		});
	}
	function loader(OBJ)
	{
		var largo = OBJ.data("opciones").array.length;
		if(OBJ.data("porcentage") < largo)
		{
			$("#RTLoutput p").text("Cargando: " + Math.round((100/largo)*OBJ.data("porcentage")) + "%");
		} else {
			$("#RTLoutput p").text("Carga terminada: " + 100 + "%");
			clearInterval(OBJ.data("timer"));
			$("#ReadThisLoader").addClass("hidden");
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
			$("#" + i).css({
				"width":OBJ.data("imagenes")[i].width,
				"heigth":OBJ.data("imagenes")[i].height,
				"background-image":"url('" + OBJ.data("imagenes")[i].src + "')",
				"background-size":"100%",
			});
		}
		OBJ.contents("#0").removeClass("hidden");
		OBJ.contents("#0").addClass("mostrar");
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
			$("#" + i).css({
				"width":OBJ.data("imagenes")[i].width,
				"heigth":OBJ.data("imagenes")[i].height,
				"background-image":"url('" + OBJ.data("imagenes")[i].src + "')",
				"background-size":"100%",
			});
		}

		OBJ.contents("#0").removeClass("hidden");
		OBJ.contents("#0").addClass("mostrar");
		
		//AJUSTAR LOS TAMAÑOS DE LAS IMAGENES Y POSICIÓN
		ajustarImagenes(OBJ);
		//CREAR LISTENERS
		crearListeners(OBJ);
	}
	function ajustarImagenes( OBJ )
	{
		var aux = OBJ.contents("#0");
		var i = 0;
		var auxW1, auxW2;
		var W = OBJ.data("opciones").width;
		var H = OBJ.data("opciones").height;
		//var rellenoURL = "img/relleno.JPG";

		
		while( aux.length > 0 )
		{	
			if( (aux.hasClass("doble")) || (i == 0) || (aux.hasClass("single")) )
			{
				auxW1 = optimizarTamano(W, H, OBJ.data("imagenes")[i].width, OBJ.data("imagenes")[i].height)
				aux.css({"width":auxW1.w,"height":auxW1.h});
				i++;
			} else if( (aux.hasClass("izquierda")) ){
				auxW1 = optimizarTamano(W, H, OBJ.data("imagenes")[i].width, OBJ.data("imagenes")[i].height);
				if( aux.next().hasClass("relleno") )
				{
					aux.next().css("width", W/2);
					aux.next().css("height", H);
					auxW2 = auxW1;
				} else {
					if( aux.next().length > 0 )
					{
						auxW2 = optimizarTamano(W, H, OBJ.data("imagenes")[i+1].width, OBJ.data("imagenes")[i+1].height);
						i++;
					} else {
						auxW2 = {W:0,h:0};
					}
				}
				if( auxW1+auxW2 > W )
				{
					auxW1 = {w:W/2, h:H};
					auxW2 = {w:W/2, h:H};
				}
				aux.css({"width":auxW1.w, "height":auxW1.h});
				aux.next().css({"width":auxW2.w, "height":auxW2.h});
				
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
					"left": (W-$(this).width())/2,
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
				return {w:W, h:Math.round(W*iH/iW)};
			} else {
				return {w:Math.round(H*iW/iH), h:H};
			}
		} else {
			if( iW > W )
			{
				return {w:W, h:Math.round(W*iH/iW)};
			} else {
				return {w:iW, h:iH};
			}
		}
	}
	//LISTENERS
	function crearListeners(OBJ)
	{
		OBJ.dblclick(function(e) {
			if(e.pageX >= (OBJ.width()/2))
			{
				OBJ.flipPage("right");
			} else {
				OBJ.flipPage("left");
			}
		});
		$(document).keyup(function(e){
			//alert(e.which);
			switch(e.which){
				case 37:	/* izquierda */
					cambiar("left");
					break;
				case 39:	/* derecha */
					cambiar("right");
					break;
				case 70:
					if( OBJ.data("fullscreen") )
					{
						$.fullscreen.exit();
					} else {
						OBJ.fullscreen();
					}
					break;
			}
		});
		$(document).bind("fscreenopen", function(e){
			OBJ.data("swapW", OBJ.data("opciones").width);
			OBJ.data("swapH", OBJ.data("opciones").height);
			OBJ.data("opciones").width = $(window).width();
			OBJ.data("opciones").height = $(window).height();
							
			ajustarImagenes(OBJ);
		});
		$(document).bind("fscreenclose", function(e){
			OBJ.data("opciones").width = OBJ.data("swapW");
			OBJ.data("opciones").height = OBJ.data("swapH");
							
			ajustarImagenes(OBJ);
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
			} else if( dir == "left" && (this.contents(".mostrar").first().attr("id") != 0) ) {
				this.contents(".mostrar").first().prev().addClass("proximo");
				if( !this.contents(".mostrar").first().prev().hasClass("doble") && (this.contents(".mostrar").first().prev().attr("id") !=0) )
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