
var ejecuciones = 0;
var progreso = 0;
var veces = 20;
var respiro = (2 * 60 * 1000);

function printConsola(texto){
    console.log("texto - > " + texto)
	var previo = "";
	if($("#consola_amazon").html()){
		previo = $("#consola_amazon").html();
	}
	var print = previo + " <br> consola > " +  texto ;
	$("#consola_amazon").html(print);
    $("#consola_amazon").animate({ scrollTop: ($("#consola_amazon").height() * 10) }, 5000);
}

function iniciarProceso(){
	printConsola("Proceso inicializado, <span style='color:blue'>oprima obtener categorias ...</span>");
	$("#segundo_amazon").slideDown(1000);
	$("#primer_amazon button").attr('disabled', 'true');
	 var tamano = 50 / 100;
    //inicializamos el dialog
    $( "#modal-avisoAmazon").dialog({
        autoOpen: false,
            show: {
                  effect: "clip",
                  duration: 500
                },
            hide: {
                  effect: "drop",
                  duration: 500
                },
             position: { 
                  my: "center", 
                  at: "center", 
                  of: window 
            },
        width: screen.width * tamano,
        resizable:false,
        title:"Aviso amazon"
    });

    $( "#modal-avisoAmazon").dialog('open');
}

function obtenerCategorias(){
	printConsola("<span style='color:blue'>Obteniendo Categorias ...</span>");
	$("#segundo_amazon button").attr('disabled', 'true');
	$.ajax({
        url: 'class/AmazonConnection.php',
        type: 'POST',
        data: {'post': 'obtenerCategorias' },
        dataType: 'html',
        success: function(response) {
            printConsola(response);
        },
        error: function(error) {
            console.log(error);
        	printConsola("<span style='color:red'>" + error + "</span>");
        },complete:function(){
        	// al terminar el proceso cerramos los primeros dos pasos
        	$("#segundo_amazon").slideUp(500);
        	$("#primer_amazon").slideUp(500);
        	// mostramos el ultimo paso
        	$("#tercero_amazon").slideDown(1000);
        	
            getCategorias();
        }
    });
}

function ejecutarProceso(){
	printConsola("<span style='color:blue'>Ejecutando proceso AMAZON ...</span>");
	printConsola("<span style='color:blue'>Obteniendo productos ...</span>");
	$("#tercero_amazon button").attr('disabled', 'true');
	$("#tercero_amazon").html("<p>Ejecutando la carga de productos</p>");
	$(".bar_fondo").show(1000);
	cargarProductos();
}

function setProgreso(progreso) {
	if(progreso <= 100){
		$("#bar_amazon").css('width', progreso + '%');
   		$("#bar_amazon").html(progreso + ' % ');
	}
}

function cargarProductos(){
	$.ajax({
        url: 'class/AmazonConnection.php',
        type: 'POST',
        data: {'post': 'cargarProductos' },
        dataType: 'html',
        success: function(response) {
            printConsola(response);
            ejecuciones = ejecuciones  + 1;
            progreso = (100 / veces) * ejecuciones;
            setProgreso(progreso);
        },
        error: function(error) {
            console.log(error);
            console.log("Productos");
        	printConsola("<span style='color:red'>" + error + "</span>");
        },complete:function(){
        	if(ejecuciones <= veces){
        		setTimeout(function(){
        			cargarProductos();
        		},respiro);
        	}else{
        		printConsola("<br> consola > <h4 style='color:blue'>Proceso completo</h4>");
        		ejecuciones = 0;
				progreso = 0;
				$("#cuarto_amazon").slideDown(1000);
				$("#tercero_amazon").hide(750)
				infoAfter();
        	}
        }
    });
}

function infoBefore(){
	$.ajax({
        url: 'class/AmazonConnection.php',
        type: 'POST',
        data: {'post': 'infoAmazon' },
        dataType: 'html',
        success: function(response) {
            $('#antes_bd').html("Existian " + response + " productos antes del proceso");
        },
        error: function(error) {
            console.log(error);
        	printConsola("<span style='color:red'>" + error + "</span>");
        }
    });
}



function infoAfter(){
	$.ajax({
        url: 'class/AmazonConnection.php',
        type: 'POST',
        data: {'post': 'infoAmazon' },
        dataType: 'html',
        success: function(response) {
            $('#despues_bd').html(response + " productos despues del proceso");
        },
        error: function(error) {
            console.log(error);
        	printConsola("<span style='color:red'>" + error + "</span>");
        }
    });
}

function getCategorias(){
    $.ajax({
        url: 'class/AmazonConnection.php',
        type: 'POST',
        data: {'post': 'getCategorias' },
        dataType: 'json',
        beforeSend: function() {
            showProgress();
        },
        success: function(response) {
            if (response.estado == 1) {
                var categorias = response.categorias;
                var options = "<option>Elige una categoria</optiom>";
                for (var i = categorias.length - 1; i >= 0; i--) {
                    options += "<option value='" + categorias[i].browse_node_amazon+ "'>"+categorias[i].name+"</option>";
                }

                $("#categoria").html(options);
            }
        },
        error: function(error) {
            $.notify("Ocurrio un error", "error")
            hideProgress();
        },
        complete: function() {
            infoBefore();
            hideProgress();
        }
    });
}

function getProductosByFiltros(){
    var categoria = $('#categoria').val();
    var pagina = $('#pagina').val();
    if(categoria != "" && pagina != ""){
        $.ajax({
            url: 'class/AmazonConnection.php',
            type: 'POST',
            data: {'post': 'getProductosByFiltros' , 'nodo' : categoria , 'pagina' : pagina},
            dataType: 'html',
            beforeSend: function() {
                showProgress();
            },
            success: function(datos) {
                printConsola(datos);
                hideProgress();
            },
            error: function(error) {
                $.notify("Ocurrio un error", "error")
                hideProgress();
            },
            complete: function() {
                infoAfter();
                $("#cuarto_amazon").slideDown(1000);
            }
        });
    }else{
        $.notify("Elige una opcion de pagina y categoria", "warn");
    }
    
}

function limpiarConsola(){
    $("#consola_amazon").html("");
}