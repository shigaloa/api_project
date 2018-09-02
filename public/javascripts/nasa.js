
    
function manejarSelectores() {

    // Mostrar listas desplegables cuando corresponda

    var seleccionado = document.getElementById("rover");
    var valor = seleccionado.options[seleccionado.selectedIndex].value;

    if (valor == 'Curiosity') {
        document.getElementById('camara_set1').style.display = "block";
        document.getElementById('camara_set2').style.display = "none";
        document.getElementById('sol').style.display = "block";
    } else if (valor == 'Opportunity' || valor == 'Spirit') {
        document.getElementById('camara_set1').style.display = "none";
        document.getElementById('camara_set2').style.display = "block";
        document.getElementById('sol').style.display = "block";
    } else {
        document.getElementById('camara_set1').style.display = "none";
        document.getElementById('camara_set2').style.display = "none";
        document.getElementById('sol').style.display = "none";
    };

}
