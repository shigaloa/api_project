function manejarSelectores() {

    // Mostrar listas desplegables cuando corresponda

    var seleccionado = document.getElementById("seleccionar");
    var valor = seleccionado.options[seleccionado.selectedIndex].value;

    if (valor == 'type') {
        document.getElementById('tipo').style.display = "block";
        document.getElementById('fuente').style.display = "none";
        document.getElementById('centrar').style.display = "none";
    } else if (valor == 'source') {
        document.getElementById('tipo').style.display = "none";
        document.getElementById('fuente').style.display = "block";
        document.getElementById('centrar').style.display = "none";
    } else if (valor == 'center') {
        document.getElementById('tipo').style.display = "none";
        document.getElementById('fuente').style.display = "none";
        document.getElementById('centrar').style.display = "block";
        ObtenerLocalizacion();
        } else {
        document.getElementById('tipo').style.display = "none";
        document.getElementById('fuente').style.display = "none";
        document.getElementById('centrar').style.display = "none";
    };

    // Obtener localización del usuario

    var sevilla = {
        latitud: -5.9731700,
        longitud: 37.3828300  
    };

    function ObtenerLocalizacion() {
        if (navigator.geolocation) {
            /* la geolocalizacion esta disponible */
            navigator.geolocation.getCurrentPosition(AsignarPosicion, MostrarErrores);
        }
        else {
            // la geolocalizacion no esta disponible 
            // Latitud y Longitud por defecto de Sevilla y mensaje en consola
            document.getElementById("latitud").value = sevilla.latitud;
            document.getElementById("longitud").value = sevilla.longitud;
            console.log("Geolocalizacion no soportada por el navegador");
        }
    }

    /* Funcion que muestra la ubicacion del usuario */
    function AsignarPosicion(position) {
        document.getElementById("latitud").value = position.coords.latitude;
        document.getElementById("longitud").value = position.coords.longitude;
        }

    /* Funcion que muestra los errores de ubicacion */
    function MostrarErrores(error) {
        // Latitud y Longitud por defecto de Sevilla y mensaje en consola

        document.getElementById("latitud").value = sevilla.latitud;
        document.getElementById("longitud").value = sevilla.longitud;
            
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("El usuario denego la petición de geolocalización.")
                break;
            case error.POSITION_UNAVAILABLE:
            console.log("Información de localización no disponible.");
                break;
            case error.TIMEOUT:
            console.log("La petición para obtener la ubicación del usuario expiró.");
                break;
            case error.UNKNOWN_ERROR:
            console.log("Error desconocido.");
            break;
        }
    }

    
}
