(function ( $ ) {
	var loadingURL = "http://www.factormetal.com/wp-content/plugins/google-calendar-widget/loading.gif";
	var rellenoURL = "img/relleno_tile.jpg";
	var fscreenIcon = "http://sliderpro.net/wp-content/uploads/icons/fullscreen.png";
	var zoomIcon = "img/zoomIcon.png";
	var zoomlvlIcon = "img/arrow-downIcon.png";

	$.fn.ReadThis = function(op) 
	{
		$("head").append("<style> .hidden{ display: none !important; visibility: hidden; z-index: -1;} .derecha, .relleno, .doble, .izquierda, .single, #ReadThisZOOM{ position: absolute; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;} .relleno{background-image:url('" + rellenoURL + "'); background.size:100%;}</style>");
		
		var opciones = $.extend({
			//default
			height:400, 
			width:800,
			backround_color:'#000',
			pages: "single",
			navegation: false,
			zoom: true,
			zoomlvl: 100,
			modo: "normal"
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
		
		//ZOOM DIV
		this.append("<div id='ReadThisZOOM' class='hidden' style='background-color:rgb(0,0,0);'><div id='RTZhitbox'></div><div id='RTZ1'></div><div id='RTZ2'></div></div>");
		//PANEL DE CONTROL DIV
		this.append("<div id='ReadThisPanel'></div>");
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
			setUpPanel(OBJ);
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
		//alert("LARGOS: " + largos);
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
		var j = 0, d = 0;
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
				d++;
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
			j++;
		}
		if( OBJ.data("opciones").pages == "single" )
		{
			OBJ.data("cantPags", d);
		} else  {
			OBJ.data("cantPags", (j+d)/2);
		}
		
		//CENTRAR EN EL LADO CORRESPONDIENTE
		OBJ.contents().each(function(){
			if( OBJ.data("opciones").modo == "normal" )
			{
				if( $(this).hasClass("izquierda") ) {
					$(this).css({
						"right": W/2,
						"left": "",
						//"top": (H-$(this).contents("img").height())/2
					});
				} else if( $(this).hasClass("derecha") || $(this).hasClass("relleno") ) {
					$(this).css({
						"left": W/2,
						"right": "",
						//"top": (H-$(this).contents("img").height())/2
					});
				} else if( $(this).hasClass("doble") || OBJ.data("opciones").pages == "single" ) {
					$(this).css({
						"left": (W-$(this).width())/2,
						//"top": (H-$(this).contents("img").height())/2
					});
				}
			} else if( OBJ.data("opciones").modo == "manga" ) {
				if( $(this).hasClass("izquierda") ) {
					$(this).css({
						"left": W/2,
						"right": "",
						//"top": (H-$(this).contents("img").height())/2
					});
				} else if( $(this).hasClass("derecha") || $(this).hasClass("relleno") ) {
					$(this).css({
						"right": W/2,
						"left": "",
						//"top": (H-$(this).contents("img").height())/2
					});
				} else if( $(this).hasClass("doble") || OBJ.data("opciones").pages == "single" ) {
					$(this).css({
						"left": (W-$(this).width())/2,
						//"top": (H-$(this).contents("img").height())/2
					});
				}
			}
		});
		$("#RTprogbar").css({
			"left": (OBJ.data("opciones").width - $("#progbar").width())/2
		});
		//SETUP ZOOM
		setUpZOOM(OBJ);
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
				case 70:	/* F */
					if( OBJ.data("fullscreen") )
					{
						$.fullscreen.exit();
						OBJ.data("fullscreen", false);
					} else {
						OBJ.fullscreen();
						OBJ.data("fullscreen", true);
					}
					break;
				case 49:	/* 1 */
					OBJ.data("opciones").zoomlvl = 100;
					setUpZOOM(OBJ);
					break;
				case 50:	/* 2 */
					OBJ.data("opciones").zoomlvl = 150;
					setUpZOOM(OBJ);
					break
				case 51:	/* 3 */
					OBJ.data("opciones").zoomlvl = 200;
					setUpZOOM(OBJ);
					break;
				case 52:	/* 4 */
					OBJ.data("opciones").zoomlvl = 300;
					setUpZOOM(OBJ);
					break;
				case 90:	/* Z */
					if( OBJ.data("opciones").zoom )
					{
						OBJ.data("opciones").zoom = false;
						if( !$("#ReadThisZOOM").hasClass("hidden") )
						{
							$("#ReadThisZOOM").addClass("hidden");
						}
					} else {
						OBJ.data("opciones").zoom = true;
					}
					break;
				case 77:
					if( OBJ.data("opciones").modo == "normal" )
					{
						OBJ.data("opciones").modo = "manga";
					} else {
						OBJ.data("opciones").modo = "normal";
					}
					ajustarImagenes(OBJ);
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
		//ZOOMING
		OBJ.mousemove(function(e){
			var H = OBJ.data("opciones").height;
			var W = OBJ.data("opciones").width;
			var offset = OBJ.offset();
			if( OBJ.data("opciones").zoom )
			{
				var margen = 5;
				var topeInf =  H - $("#ReadThisZOOM").height();
				var topeDer =  W - $("#ReadThisZOOM").width();
				var porH = H/100;
				var porW = W/100;

				if( (e.pageX > offset.left + margen) && (e.pageX < offset.left + W - margen) && (e.pageY > offset.top + margen) && (e.pageY < offset.top + H - margen) )
				{
					$("#ReadThisZOOM").removeClass("hidden");
					//VERTICAL
					if( (e.pageY <= 20*porH) )
					{ 
						$("#ReadThisZOOM").css("top", 0);
					} else if( (e.pageY >=20*porH) && (e.pageY <= 80*porH) ){
						var porH2 = (e.pageY - 20*porH)*100/(60*porH);
						$("#ReadThisZOOM").css("top", porH2*topeInf/100);
					} else if( e.pageY > 80*porH ){
						$("#ReadThisZOOM").css("top", topeInf);
					}
					//HORIZONTAL
					if( (e.pageX <= 20*porW) )
					{ 
						$("#ReadThisZOOM").css("left", 0);
					} else if( (e.pageX >= 20*porW) && (e.pageX <= 80*porW) ){
						var porW2 = (e.pageX - 20*porW)*100/(60*porW);
						$("#ReadThisZOOM").css("left", porW2*topeDer/100);
					} else if(e.pageX > 80*porW){
						$("#ReadThisZOOM").css("left", topeDer);
					}
				} else {
					$("#ReadThisZOOM").addClass("hidden");
				}
			}
			//PANEL SHOW
			if( e.pageY >= offset.top + H - 40 )
			{
				if( !OBJ.data("panelON") )
				{
					OBJ.data("panelON", true);
					$("#ReadThisPanel").animate({opacity: 1}, {duration: 500,  queue: false});
				}
			} else {
				if( OBJ.data("panelON") )
				{
					OBJ.data("panelON", false);
					$("#ReadThisPanel").animate({opacity: 0}, {duration: 500,  queue: false});
				}
			}
		});
		$("#ReadThisZOOM").mouseout(function(e){
			$("#ReadThisZOOM").addClass("hidden");
		});
		//PANEL CLICKS
		$("#ReadThisPanel").click(function(e){
			var H = OBJ.data("opciones").height;
			var W = OBJ.data("opciones").width;
			var offset = OBJ.offset();
			
			if( (e.pageX >= offset.left + W - 40) )
			{
				if( OBJ.data("fullscreen") )
				{
					$.fullscreen.exit();
					OBJ.data("fullscreen", false);
					$("#ReadThisZOOM").addClass("hidden");
				} else {
					OBJ.fullscreen();
					OBJ.data("fullscreen", true);
					$("#ReadThisZOOM").addClass("hidden");
				}
			} else if( (e.pageX <= offset.left + 40) ) {
				if( OBJ.data("opciones").zoom )
				{
					OBJ.data("opciones").zoom = false;
					if( !$("#ReadThisZOOM").hasClass("hidden") )
					{
						$("#ReadThisZOOM").addClass("hidden");
					}
				} else {
					OBJ.data("opciones").zoom = true;
				}
			}
		});
	}
	//ZOOM
	function setUpZOOM( OBJ )
	{
		var aux = OBJ.contents(".mostrar");
		var W, H, id = aux.first().attr("id");
		var rate = OBJ.data("opciones").zoomlvl/100;
		var RTZ1, RTZ2;
		
		if( OBJ.data("opciones").modo == "normal" )
		{
			RTZ1 = $("#RTZ1");
			RTZ2 = $("#RTZ2");
		} else if( OBJ.data("opciones").modo == "manga" ) {
			RTZ1 = $("#RTZ2");
			RTZ2 = $("#RTZ1");
		}
		
		
		//RTZ1
		RTZ1.css({
			"width": OBJ.data("imagenes")[id].width*rate,
			"height": OBJ.data("imagenes")[id].height*rate,
			"background-image": "url('" + OBJ.data("imagenes")[id].src + "')",
			"background-size": "100%",
			"float": "left"
		});
		W = OBJ.data("imagenes")[id].width*rate;
		H = OBJ.data("imagenes")[id].height*rate;
		if( !(aux.first().hasClass("doble") || (OBJ.data("opciones").pages == "single") || aux.first().hasClass("derecha")) && !aux.last().hasClass("relleno") )
		{
				//RTZ2
				id = aux.last().attr("id");
				
				RTZ2.css({
					"width": OBJ.data("imagenes")[id].width*rate,
					"height": OBJ.data("imagenes")[id].height*rate,
					"background-image": "url('" + OBJ.data("imagenes")[id].src + "')",
					"background-size": "100%",
					"float": "left"
				});
				W += OBJ.data("imagenes")[id].width*rate;
		} else {
				RTZ2.css({
					"width": 0,
					"height": 0,
				});
		}
		$("#ReadThisZOOM").css({
				"width": W,
				"height": H,
				"z-index": 9000,
		});
		$("#RTZhitbox").css({
				"width": W,
				"height": H,
				"z-index": 9000,
				"position": "absolute"
		});
	}
	//PANEL DE CONTROL
	function setUpPanel(OBJ)
	{
		OBJ.data("panelON", false);
		$("#ReadThisPanel").css({
			"height": 40,
			"width": "100%",
			"position": "absolute",
			"left":0,
			"bottom":0,
			"z-index": 9001,
			"opacity": 0,
			"background-color": "rgba(0,0,0,0.7)"
		});
		$("#ReadThisPanel").append("<div id='RTfscreen'></div>");
		$("#RTfscreen").css({
			"background-image": "url('" + fscreenIcon + "')", 
			"background-size": "100%",
			"width": 32,
			"height": 32,
			"float": "right",
			"margin-right": 5,
			"margin-top": 5,
		});
		$("#ReadThisPanel").append("<div id='RTzoom'></div>");
		$("#RTzoom").css({
			"background-image": "url('" + zoomIcon + "')", 
			"background-size": "100%",
			"width": 32,
			"height": 32,
			"float": "left",
			"margin-left": 5,
			"margin-top": 5,
		});
		$("#ReadThisPanel").append("<div id='RTzoomlvl'></div>");
		$("#RTzoomlvl").css({
			"background-image": "url('" + zoomlvlIcon + "')", 
			"background-size": "100%",
			"width": 10,
			"height": 32,
			"float": "left",
			"margin-left": 5,
			"margin-top": 5,
		});
		$("#ReadThisPanel").append("<div id='RTprogbar'><div id='progtext'></div><div id='progbar'><span></span></div></div>");
		$("#progtext").css({
			"color": "#FFFFFF",
			"float": "left",
			"font-family": "Helvetica",
			"margin-right": "5px",
			"margin-top": "10px"
		});
		$("#progtext").text("1/" + OBJ.data("cantPags"));
		OBJ.data("pagActual", 1);
		$("#progbar").css({
			"height": 8,
			"width": 350,
			"margin-top": 17,
			"float": "left",
			"background-color": "#3F0000"
		});
		$("#progbar span").css({
			"height": 8,
			"width": 0,
			"float": "left",
			"background-color": "#FF0000"
		});
		$("#RTprogbar").css({
			"height": 32,
			"position": "absolute",
			"left": (OBJ.data("opciones").width - $("#progbar").width())/2
		});
	}
	$.fn.flipPage = function( dir )
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
				
				this.data("pagActual", this.data("pagActual") + 1);
			} else if( dir == "left" && (this.contents(".mostrar").attr("id") != 0) ) {
				this.contents(".mostrar").prev().addClass("proximo");
				this.contents(".mostrar").addClass("hidden"); 
				this.contents(".mostrar").removeClass("mostrar");
				this.contents(".proximo").addClass("mostrar");
				this.contents(".proximo").removeClass("hidden"); 
				this.contents(".proximo").removeClass("proximo");
				
				this.data("pagActual", this.data("pagActual") - 1);
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
				
				this.data("pagActual", this.data("pagActual") + 1);
			} else if( dir == "left" && (this.contents(".mostrar").first().attr("id") != 0) ) {
				this.contents(".mostrar").first().prev().addClass("proximo");
				if( !this.contents(".mostrar").first().prev().hasClass("doble") && (this.contents(".mostrar").first().prev().attr("id") !=0) )
				{
					this.contents(".proximo").prev().addClass("proximo");
				}
				this.contents(".mostrar").each(function(){$(this).addClass("hidden"); $(this).removeClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).addClass("mostrar");});
				this.contents(".proximo").each(function(){$(this).removeClass("hidden"); $(this).removeClass("proximo");});
				
				this.data("pagActual", this.data("pagActual") - 1);
			}
		}
		var suma;
		$("#progtext").text(this.data("pagActual") + "/" + this.data("cantPags"));
		$("#progbar span").css("width", ((this.data("pagActual")-1)/(this.data("cantPags")-1))* $("#progbar").width());
		setUpZOOM(this);
	};
}( jQuery ));