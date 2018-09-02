var mongoose = require( 'mongoose' );

var recomendacionSchema = new mongoose.Schema({
    autor: {type: String, required: true},
    puntuacion: {type: Number, required: true, "default": 0, min: 0, max: 5},
    comentario: {type: String, required: true},
    creado: {type: Date, "default": Date.now}
});

var rest_apiSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    linea1: {type: String},
    linea2: {type: String},
    puntuacion: {type: Number, "default": 0, min: 0, max: 5},
    detalle: {
        cabecera: {
            subtitulo: {type: String}
        },
        imagen: {
            cabecera: {type: String},
            descripcion: {
                linea1: {type: String},
                linea2: {type: String}
            },
            pie: {type: String}
        },
        formulario: {
            cabecera: {type: String},
            descripcion: {
                linea1: {type: String},
                linea2: {type: String}
            },
            pie: {type: String}
        }
    },
    recomendaciones: [recomendacionSchema]
});

mongoose.model('Rest_api', rest_apiSchema);