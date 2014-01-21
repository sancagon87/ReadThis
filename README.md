ReadThis by Santiago Callejas
==============================================

Simple Comic Reader JQUERY Plugin

Requires: JQUERY, JQUERY.FULLSCREEN by Vladimir Zhuravlev (http://plugins.jquery.com/fullscreener/)

WARNING!: The proyect is currently on Alpha release stage. Bugs are to be expected.

USAGE: $("#ReadThis").ReadThis(options);

	OPTIONS LIST: 
		- array: An array of images urls
		- pages: Display of the pages; "Simple" or "Double" ("Double" by default)
		- height: Height of the viewport
		- width: Width of the viewport
		- backround_color: Color of the background (black by default)
		- zoom: Toogles Zoom at start (True/False, True by default)
		- mode: The order the pages are displayed (Only on "Double" pages setting). Accepts "standard" or "manga" ("standard" by default).
		
	Example:
	-----------------------------------------
		$(document).ready(function(){
			$("#ReadThis").ReadThis({
				array: ["img/img1.jpg"
						,"img/img2.jpg"
						,"img/img3.jpg" 
						,"img/img4.jpg" 
						,"img/img5.jpg" 
						,"img/img6.jpg" 
						,"img/img7.jpg" 
						,"img/img8.jpg"]
				,background_color: "#000"
				,width: 800
				,height: 400
				,pages: "double"
			});
		});
	----------------------------------------
	
KEYBINDINGS:
	
	- Flip page right: "Right arrow" OR Double click on the right side of the viewport.
	- Flip page left: "Left arrow" OR Double click on the left side of the viewport.
	- Toogle Fullscreen: "F"
	- Toogle Zoom: "Z"
	- Zoom level x1: "1"
	- Zoom level x1.5: "2"
	- Zoom level x2: "3"
	- Zoom level x2.5: "4"
	- Reading Mode (Standard/Manga): "M"

