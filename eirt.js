/**!
 * Exame Informática Reader Tools
 * https://github.com/pedrofsantoscom/exame-informatica-reader-tools
 *
 * Copyright 2015 Pedro F. Santos, http://pedrofsantos.com, me@pedrofsantos.com
 * Released under the MIT license
 * http://en.wikipedia.org/wiki/MIT_License
 *
 * Version: 2015.09.22
 */
var EIReaderTools =
{
	version: "2015.09.22",
	options:
	{
		fullscreen:
		{
			icon:
			{
				on: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgEApAAAAAZ0Uk5TAA+fz9/vpTOW9gAAAJNJREFUKM/NkkEKwyAUBSeeQOoFDAX3duERcoQcQJN3/yN08RVLUui2fyE4Ph/IyPLiY56eoDj3TpmiOkFSI2lEPE6qtgSA3A+TtBaA9pAq4KRTANr77SQZUO93E1j9sg9wegDCTGQAygTN80fz+3FsAxx8T1w7nHQY2CySpJgAqpMq3QVANA3mwo/6eld5k339Dm89PDdxiEGVaQAAAABJRU5ErkJggg==",
				off: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNrsV0EOwCAI6w/8/6lP8gk8ZTuPLUoirltCEy8mpY0iIAAcg0WsgxONreIRE4+bhnzYr05AkgO2wQQHV3wxwAmBieJe6xY8w0Q0BlcDZHOngXqA1zPziE68BTjNmWDGM4qKexNEoVAoJPVzWSGSlmJpM3q1HcsHEvlI9omhtL5m9TWT5cApwAD/IigEZttSgAAAAABJRU5ErkJggg=="
			}
		},
		// backup of the original functions
		savedFunctions:
		{
			"ResizeViewer":
			{
				"orig": ResizeViewer,
				"mod": function()
				{
					var b = Math.max(400, document.documentElement.clientHeight), a = Math.round(pw * b / ph);
					ResizeMenu();
					if (zoom) {
						a = Math.max(1000, Math.min(1502, document.documentElement.clientWidth));
						$("#bvdPage div.pages").width(a).height(b).children(".panviewport").width(a).height(b)
					}
					if ((zoom || crop != null)) {
						return;
					}
					RszImgs(a, b)
				},
			},
			"CancelZoom":
			{
				"orig": CancelZoom,
				"mod": function(e)
				{
					var $this = $(this).find("img");
					$("#bvdMenu").show();
					$this.css("transform", "");
					EIReaderTools.options.savedFunctions.CancelZoom.orig();
				},
			},
			"PageChange":
			{
				"orig": PageChange,
				"mod": function()
				{
					CancelCut();
					Tag();
					TagAd();
					if (!smode)
						$(window).trigger("resize");
					if (player)
						$("#jqp").jPlayer("play");

					// custom event: before sending request
					$(document).trigger("endPageChanged.eirt");

					$("#ctl00_cph_viewer1_bvdPages").append($("<div>").addClass("eirt-loading"));
				}
			}
		},
	},
	// highlight current page on the side menu
	highlightSidePage: function()
	{
		var currPage = GetPage().p;
		var $container = $('#bvdMenuInner');
		var $imgs = $("#bvdMenuImg img").removeClass("eirt-highlight");
		var $el = $imgs.eq(currPage);

		$el.addClass("eirt-highlight");
		$imgs.eq(currPage + ((currPage % 2 == 0) ? 1 : -1)).addClass("eirt-highlight");

		$container.stop().animate(
		{
			scrollTop: parseInt(currPage / 2) * 98
		}, 1000);
	},
	// activates custom loading for the page "start ajax request"
	requestPageLoading: function(e)
	{
		e = e || {type: "click", target: $(".crn.topright")[0]};
		var containers = $("#bvNav td.bvNavLinkSec, #bvdMenuImg img, .crn.topleft, .crn.topright");
		var loading = $(".eirt-loading");

		if ((e.type === "click"
			&& containers.find(e.target).length
			|| containers.is(e.target))
		&& loading.css("display") === "none")
		{
			loading.css("display", "block");
			$(document).one("endPageChanged.eirt", function()
				{
					$(".eirt-loading").remove();
				});

		}
	},
	// "jump to page" init method
	initPagination: function()
	{
		var el = $("<div>", {id: "eirt-pag-cont"})
			.css(
			{
				"display": "inline-block",
				"color": "#000",
				"position": "relative",
				"padding": "0 2px",
				"border-left": "1px solid hsl(0, 0%, 70%)",
				"border-right": "1px solid hsl(0, 0%, 70%)",
			})
			.insertAfter($("#eirt-state"));

		// jump to page event handler
		var goToPage = function(e)
		{
			e.stopPropagation();
			e.preventDefault();

			if (e.type !== "click")
			{
				var keycode = (e.keyCode ? e.keyCode : e.which);
				if (keycode !== 13 || e.type !== "keyup")
					return false;
			}

			var $this = $(this);
			var input = $this;
			if ($this.siblings('#eirt-pag-input').length > 0)
				input = $this.siblings('#eirt-pag-input');
			var inputVal = input.val();
			var imgs = $("#bvdMenuImg img[onclick]");
			input.val("");
			var specialPages =
			{
				"i": 2,
				"inicio": 0,
				"fim": imgs.length - 1
			};
			var specialPagesEN =
			{
				"i": 2,
				"begin": 0,
				"end": imgs.length - 1
			};
			if (specialPages[inputVal] != null || specialPagesEN[inputVal] != null)
			{
				$(imgs[specialPages[inputVal] || specialPagesEN[inputVal]]).click();
				return;
			}
			var num = parseInt(inputVal);
			if (num == null || num === NaN)
				return;
			var numLimited = Math.max(Math.min(num, imgs.length), 0);
			$(imgs[numLimited]).click();

			EIReaderTools.requestPageLoading();
		};

		// shortcut to focus the input box, event handler
		var focusInput = function(e)
		{
			if (e.which == 80 && e.altKey)
				$("#eirt-pag-input").focus();
		};

		var focusOutInput = function() // input got focus
		{
			$(this).on("keyup.esc.eirt", function(e) // wait for esc key to unfocus
				{
					var $this = $(this);
					if (e.which === 27 && $this.is(":focus"))
					{
						document.getElementByTagName().blur();
						return false;
					}

				}).one("blur.esc.eirt", function() // on focus out, remove above event
				{
					$(this).off("keyup.esc.eirt");
				});
		};

		$("<input>",
			{
				id: "eirt-pag-input",
				type: "text",
				placeholder: "Página"
			})
			.css(
			{
				"width": "40px",
				"height": "14px",
				"margin": "0px 3px 0 5px",
			})
			.appendTo(el);

		$(document)
			.on("keyup.eirt", focusInput)
			.on("keyup.eirt", "#eirt-pag-input", goToPage)
			.on("focus.eirt", "#eirt-pag-input", focusOutInput)
			.on("click.eirt", "#eirt-pag-acc", goToPage);
	},
	// "previous (left arrow) and next (right arrow) page" init method
	initNavigation: function()
	{
		$(document).on("keyup.eirt", function(e)
		{
			var imgs = $("#bvdMenuImg img[onclick]");
			var $handlerL = $(".page.fleft");
			var $handlerR = $(".page.fright");

			// right arrow
			if (e.which === 39)
			{
				if ($handlerR.length === 0)
					$handlerR = $(".page:visible");
				var src = $handlerR.attr("src");
				var page = +src.split("/")[3].replace("f", "");

				if (page < imgs.length - 1)
					$(".crn.topright").click();
			}
			// left arrow
			else if (e.which === 37)
			{
				if ($handlerL.length === 0)
					$handlerL = $(".page:visible");
				var src = $handlerL.attr("src");
				var page = +src.split("/")[3].replace("f", "");

				if (page > 1)
					$(".crn.topleft").click();
			}
			else
				return;

			EIReaderTools.requestPageLoading();
		});
	},
	// overriding the default mousewheel action to
	// zoom in and out the page
	initZoom: function()
	{
		var mathLimit = function(value, min, max)
		{
			return Math.max(Math.min(value, max), min);
		};

		// catch mousewheel action event handler
		$(document).on("mousewheel.eirt", ".panviewport", function(e)
			{
				//$(this).css("overflow", "hidden");
				var $this = $(this).find("img:visible");
				var deltaY = -e.originalEvent.deltaY;
				/*
				var imgW = $this.width();
				var imgH = $this.height();
				var mouseX = mathLimit(e.clientX - $this.offset().left, 0, imgW);
				var mouseY = mathLimit(e.clientY - $this.offset().top, 0, imgH);
				var pointX = Math.abs(mouseX * 100 / imgW);
				var pointY = Math.abs(mouseY * 100 / imgH);
				*/
				var scaleValue = $this.data("scale") || 1;

				var scale = mathLimit((deltaY / 1000) + scaleValue, 0.1, 1);
				var transform = "scale("+scale+")".replace("@par", scale);
				/*
				var transformOrigin = mathLimit(pointX, 0, 100)+"% "+mathLimit(pointY, 0, 100)+"%";
				*/

				// save scale value and apply transform to .panviewport
				$this.data("scale", scale)
					.css(
					{
						"transform": transform,
						//"transform-origin": transformOrigin,
					});
				e.preventDefault();
			});
	},
	// inits the fullscreen functionality
	initFullscreen: function()
	{
		var icons = EIReaderTools.options.fullscreen.icon;
		// fullscreen icon click, event handler
		// toggles fullscreen on and off
		var toggleFullscreen = function(e)
		{
			var $this = $(this);

			// redefine $this when using ESC key
			if (e.type === "keyup")
				$this = $("#eirt-fs");

			// keyup event triggered but not ESC key
			if ((e.which !== 27 && e.type === "keyup")
			|| e.which === 27 && !$this.data("mode"))
				return;

			e.data = e.data || {};
			e.data.modeOverride = (e.data) ? e.data.modeOverride : null;

			var mode = (e.data.modeOverride != null) ? e.data.modeOverride : !$this.data("mode");
			var bgcolor = 'url("data:image/png;base64,'+icons.off+'")';
			var fsLeft = "50%";
			var fsTransform = "-219%";
			var fsTop = "6px";
			var func = "orig";
			var holder = $("#zahirad192");
			$("#bvdPage_css").remove();

			// turn on fullscreen else the default is turn off
			if (mode)
			{
				$("<style>", {id: "bvdPage_css"}).html(
					"#bvdPage\
					{\
						position: absolute;\
						top: 0;\
						right: 0;\
						left: 0;\
						bottom: 0;\
						margin: 0;\
						z-index: 1000;\
						background-color: #F5F5F5;\
					}").appendTo($("head"));

				func = "mod"
				bgcolor = 'url("data:image/png;base64,'+icons.on+'")';
				holder = $("body");
				fsPosition = "absolute";
				fsTop = "0";
				fsLeft = "0";
				fsTransform = "0%";
			}

			var style = $("#eirt-container")
				.css(
				{
					"left": fsLeft,
					"top": fsTop,
				})
				.attr("style");

			$("#eirt-container").attr("style", style+";transform: translateX("+fsTransform+");");

			$this.css("background-image", bgcolor);
			$this.data("mode", mode);

			ResizeViewer = EIReaderTools.options.savedFunctions["ResizeViewer"][func];
			$(window).trigger("resize");
		};

		// fullscreen ui element
		var $fs = $("<div>", {id: "eirt-fs"})
			.css(
			{
				"display": "inline-block",
				"width": "15px",
				"height": "15px",
				"background-image": 'url("data:image/png;base64,'+icons.off+'")',
				"margin-left": "5px",
				"position": "relative",
				"top": "3px",
				"background-size": "100%",
			})
			.data("mode", false)
			.click(toggleFullscreen)
			.insertAfter($("#eirt-pag-cont"));

		$(document).on("keyup.fullscreen.eirt", {modeOverride: false}, toggleFullscreen);
	},
	// entry point for the tool
	init: function()
	{
		// remove EIRT if already exists
		EIReaderTools.reset();

		// watch for specific elements clicks to trigger custom loading
		$(document).on("click.eirt.requestStarted", EIReaderTools.requestPageLoading);

		// ui container
		$("<div>", {id: "eirt-container"})
			.css(
			{
				"position": "absolute",
				"left": "50%",
				"transform": "translateX(-219%)",
				"top": "5px",
				"z-index": "1010",
				"background": "#fff",
				"padding": "4px",
				"border-right": "1px solid hsl(0, 0%, 70%)",
				"border-bottom": "1px solid hsl(0, 0%, 70%)",
			})
			.appendTo($("body"));

		// tool loading state and its name
		$("<span>", {id: "eirt-state"})
			.text("EIReaderTools")
			.css(
			{
				"color": "#f00",
				"margin-right": "5px",
				"position": "relative",
				"top": "-4px",
			}).appendTo($("#eirt-container"));

		//
		$("head").append($("<style>", {id: "eirt-style"})
			.text(
				'#eirt-state:after{'+
					'content: "v'+EIReaderTools.version+'";'+
					'color: black;'+
					'font-size: 8px;'+
					'position: absolute;'+
					'left: 0;'+
					'bottom: -8px;'+
					'margin-left: 32px;}'+
				'#bvdMenuImg img.eirt-highlight{'+
					'border: 4px solid rgb(0, 173, 239);'+
					'margin: 0;}'+
				// http://stephanwagner.me/only-css-loading-spinner
				'@keyframes loading{'+
					'to {transform: rotate(360deg);}}'+
				'@-webkit-keyframes loading{'+
					'to {-webkit-transform: rotate(360deg);}}'+
				'.eirt-loading{'+
					'display: none;'+
					'min-width: 100%;'+
					'min-height: 100%;'+
					'position: absolute;'+
					'background-color: hsla(100, 0%, 0%, 0.5);}'+
				'.eirt-loading:before{'+
					'content: "A carregar...";'+
					'position: absolute;'+
					'top: 50%;'+
					'left: 50%;'+
					'width: 150px;'+
					'height: 150px;'+
					'margin-top: -75px;'+
					'margin-left: -75px;}'+
				'.eirt-loading:not(:required):before{'+
					'content: "";'+
					'border-radius: 50%;'+
					'border-top: 10px solid #03ade0;'+
					'border-right: 0px solid transparent;'+
					'animation: loading 1s linear infinite;'+
					'-webkit-animation: loading 1s linear infinite;}'
				)
			);

		$("#ctl00_cph_viewer1_bvdPages").append($("<div>").addClass("eirt-loading"));
		$(document).on("endPageChanged.eirt", EIReaderTools.highlightSidePage);

		// apply a moded function
		CancelZoom = EIReaderTools.options.savedFunctions.CancelZoom.mod;
		PageChange = EIReaderTools.options.savedFunctions.PageChange.mod;

		EIReaderTools.initPagination();
		EIReaderTools.initNavigation();
		EIReaderTools.initFullscreen();
		EIReaderTools.initZoom();
		EIReaderTools.highlightSidePage();

		// load success, change color of #eirt-state
		$("#eirt-state").css("color", "#32CD32");
	},
	// remove the EIRT
	reset: function()
	{
		// remove the ui elements
		$("#eirt-container,#eirt-style").remove();

		$("#bvdMenuImg img").removeClass("eirt-highlight")

		// set the original functions in place
		ResizeViewer = EIReaderTools.options.savedFunctions.ResizeViewer.orig;
		CancelZoom = EIReaderTools.options.savedFunctions.CancelZoom.orig;
		PageChange = EIReaderTools.options.savedFunctions.PageChange.orig;

		// unbind events
		$(document)
			.off("click.eirt.requestStarted")
			.off("click.eirt")
			.off("dblclick.eirt")
			.off("mousewheel.eirt")
			.off("keyup.eirt")
			.off("keyup.fullscreen.eirt")
			.off("endPageChanged.eirt");
	},
}

$(document).ready(EIReaderTools.init);