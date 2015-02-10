# Exame Informática Reader Tools

- [English](#english)
- [Português](#português)

## English
### What is it?
Enhancements for desktop readers of [Exame Informática online magazine](http://exameinformatica.assineja.pt/) reader.

(TODO: continue english readme)

## Português
### O que é
Funcionalidades adicionais para o leitor da [revista online Exame Informática](http://exameinformatica.assineja.pt/).

### Como instalar

  1. Copiar o código abaixo:
  
  ```javascript
  javascript: var EIReaderTools={version:"2015.02.09",options:{fullscreen:{icon:{on:"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgEApAAAAAZ0Uk5TAA+fz9/vpTOW9gAAAJNJREFUKM/NkkEKwyAUBSeeQOoFDAX3duERcoQcQJN3/yN08RVLUui2fyE4Ph/IyPLiY56eoDj3TpmiOkFSI2lEPE6qtgSA3A+TtBaA9pAq4KRTANr77SQZUO93E1j9sg9wegDCTGQAygTN80fz+3FsAxx8T1w7nHQY2CySpJgAqpMq3QVANA3mwo/6eld5k339Dm89PDdxiEGVaQAAAABJRU5ErkJggg==",off:"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNrsV0EOwCAI6w/8/6lP8gk8ZTuPLUoirltCEy8mpY0iIAAcg0WsgxONreIRE4+bhnzYr05AkgO2wQQHV3wxwAmBieJe6xY8w0Q0BlcDZHOngXqA1zPziE68BTjNmWDGM4qKexNEoVAoJPVzWSGSlmJpM3q1HcsHEvlI9omhtL5m9TWT5cApwAD/IigEZttSgAAAAABJRU5ErkJggg=="}},savedFunctions:{ResizeViewer:{orig:ResizeViewer,mod:function(){var e=Math.max(400,document.documentElement.clientHeight),i=Math.round(pw*e/ph);ResizeMenu(),zoom&&(i=Math.max(1e3,Math.min(1502,document.documentElement.clientWidth)),$("#bvdPage div.pages").width(i).height(e).children(".panviewport").width(i).height(e)),zoom||null!=crop||RszImgs(i,e)}},CancelZoom:{orig:CancelZoom,mod:function(){var e=$(this).find("img");$("#bvdMenu").show(),e.css("transform",""),EIReaderTools.options.savedFunctions.CancelZoom.orig()}}}},initPagination:function(){var e=$("<div>",{id:"eirt-pag-cont"}).css({display:"inline-block",color:"#000",position:"relative",padding:"0 2px","border-left":"1px solid hsl(0, 0%, 70%)","border-right":"1px solid hsl(0, 0%, 70%)"}).insertAfter($("#eirt-state")),i=function(e){if(e.stopPropagation(),e.preventDefault(),"click"!==e.type){var i=e.keyCode?e.keyCode:e.which;if(13!==i||"keyup"!==e.type)return!1}var t=$(this),o=t;t.siblings("#eirt-pag-input").length>0&&(o=t.siblings("#eirt-pag-input"));var n=o.val(),r=$("#bvdMenuImg img[onclick]");o.val("");var a={i:2,inicio:0,fim:r.length-1};if(null!=a[n])return void $(r[a[n]]).click();var s=parseInt(n);if(null!=s&&0/0!==s){var l=Math.max(Math.min(s,r.length),0);$(r[l]).click()}},t=function(e){80==e.which&&e.altKey&&$("#eirt-pag-input").focus()};$("<input>",{id:"eirt-pag-input",type:"text",placeholder:"Página"}).css({width:"40px",height:"14px",margin:"0px 3px 0 5px"}).appendTo(e),$(document).on("keyup.eirt",t).on("keyup.eirt","#eirt-pag-input",i).on("click.eirt","#eirt-pag-acc",i)},initNavigation:function(){$(document).on("keyup.eirt",function(e){var i=$("#bvdMenuImg img[onclick]"),t=$(".page.fleft"),o=$(".page.fright");if(39===e.which){0===o.length&&(o=$(".page:visible"));var n=o.attr("src"),r=+n.split("/")[3].replace("f","");r<i.length-1&&$(".crn.topright").click()}else if(37===e.which){0===t.length&&(t=$(".page:visible"));var n=t.attr("src"),r=+n.split("/")[3].replace("f","");r>1&&$(".crn.topleft").click()}})},initZoom:function(){var e=function(e,i,t){return Math.max(Math.min(e,t),i)};$(document).on("mousewheel.eirt",".panviewport",function(i){var t=$(this).find("img:visible"),o=-i.originalEvent.deltaY,n=t.data("scale")||1,r=e(o/1e3+n,.1,1),a="scale("+r+")".replace("@par",r);t.data("scale",r).css({transform:a}),i.preventDefault()})},initFullscreen:function(){{var e=EIReaderTools.options.fullscreen.icon,i=function(){var i=$(this),t=!i.data("mode"),o='url("data:image/png;base64,'+e.off+'")',n="50%",r="-219%",a="6px",s="orig",l=$("#zahirad192");$("#bvdPage").removeAttr("style"),t&&($("#bvdPage").css({position:"absolute",top:"0",right:"0",left:"0",bottom:"0",margin:"0","z-index":"1000","background-color":"#F5F5F5"}),s="mod",o='url("data:image/png;base64,'+e.on+'")',l=$("body"),fsPosition="absolute",a="0",n="0",r="0%");var c=$("#eirt-container").css({left:n,top:a}).attr("style");$("#eirt-container").attr("style",c+";transform: translateX("+r+");"),i.css("background-image",o),i.data("mode",t),ResizeViewer=EIReaderTools.options.savedFunctions.ResizeViewer[s],$(window).trigger("resize")};$("<div>",{id:"eirt-fs"}).css({display:"inline-block",width:"15px",height:"15px","background-image":'url("data:image/png;base64,'+e.off+'")',"margin-left":"5px",position:"relative",top:"3px","background-size":"100%"}).data("mode",!1).click(i).insertAfter($("#eirt-pag-cont"))}$(document).on("click.eirt",".crn.topright, .crn.topleft",function(){var e=$("#eirt-fs");e.data("mode")&&e.click()})},init:function(){EIReaderTools.reset(),$("<div>",{id:"eirt-container"}).css({position:"absolute",left:"50%",transform:"translateX(-219%)",top:"5px","z-index":"1010",background:"#fff",padding:"4px","border-right":"1px solid hsl(0, 0%, 70%)","border-bottom":"1px solid hsl(0, 0%, 70%)"}).appendTo($("body")),$("<span>",{id:"eirt-state"}).text("EIReaderTools").css({color:"#f00","margin-right":"5px",position:"relative",top:"-4px"}).appendTo($("#eirt-container")),$("head").append($("<style>",{id:"eirt-style"}).text('#eirt-state:after{content: "v"'+EIReaderTools.version+";color: black;font-size: 8px;position: absolute;left: 0;bottom: -8px;margin-left: 32px;}")),CancelZoom=EIReaderTools.options.savedFunctions.CancelZoom.mod,EIReaderTools.initPagination(),EIReaderTools.initNavigation(),EIReaderTools.initFullscreen(),EIReaderTools.initZoom(),$("#eirt-state").css("color","#32CD32")},reset:function(){$("#eirt-container,#eirt-style").remove(),ResizeViewer=EIReaderTools.options.savedFunctions.ResizeViewer.orig,CancelZoom=EIReaderTools.options.savedFunctions.CancelZoom.orig,$(document).off("click.eirt").off("dblclick.eirt").off("mousewheel.eirt").off("keyup.eirt")}};$(document).ready(EIReaderTools.init);
  ```
  2. Criar um novo favorito no navegador da internet com o nome "Exame Informática Reader Tools"
  3. Colar o que copiaste acima para o campo "URL"/"Link"
  4. Se preferires, coloca o favorito num local com bom acesso (por exemplo na barra dos favoritos)
  
### Como usar

  Depois de teres instalado, basta clickares no favorito para aparecer a ferramenta no topo da página, ao lado do logo da Exame Informática.
  
#### Ferramentas
  
  - Navegação das páginas
    - usar telca SETA ESQUERDA ou tecla SETA DIREITA
  - Saltar para página (ALT+P para ativar caixa de texto)
    - escrever número de página seguido da tecla ENTER, para saltar para essa página
    - ou escrever texto especial (sem aspas):
      - "inicio": ir para a 1º página
      - "i": ir para a página do índice
      - "fim": ir para a última página
  - Ecrã inteiro
    - usar o icon do ecrã inteiro
  - Zoom de uma página
    - clickar numa página e usar a roda de SCROLL do rato para aproximar ou afastar a página
