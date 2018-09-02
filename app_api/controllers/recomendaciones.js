var mongoose = require('mongoose');
var Rest = mongoose.model('Rest_api');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.recomendacionesCrear = function (req, res) {
    var rest_apiid = req.params.rest_apiid;
    if (rest_apiid){
        Rest
            .findById(rest_apiid)
            .select('recomendaciones')
            .exec(
                function (err, rest_api){
                    if (err){
                        sendJsonResponse(res, 400, err);
                    } else {
                        creaRecomendacion(req, res, rest_api);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 400, {"mensaje" : "Api requerida"
        });
    }
};

var creaRecomendacion = function(req, res, rest_api){
    if (!rest_api){
        sendJsonResponse(res, 404, {"mensaje": "No se encuentra Api"});
    } else {
        rest_api.recomendaciones.push({
            autor: req.body.autor,
            puntuacion: req.body.puntuacion,
            comentario: req.body.comentario
        });
        rest_api.save(function(err, rest_api){
            var estaRecomendacion;
            if (err){
                sendJsonResponse(res, 400, err);
            } else {
                actualizarPuntuacion(rest_api._id);
                estaRecomendacion = rest_api.recomendaciones[rest_api.recomendaciones.length -1];
                sendJsonResponse(res, 201, estaRecomendacion);
            }
        });
    }
};

module.exports.recomendacionesLeerUno = function (req, res) {
    if (req.params && req.params.rest_apiid && req.params.recomendacionid){
        Rest
          .findById(req.params.rest_apiid)
          .select('nombre recomendaciones')
          .exec(function(err,rest_api){
            var response, recomendacion;
            if (!rest_api){
                sendJsonResponse(res, 404, {
                    "mensaje": "Api no encontrada"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            };
            if (rest_api.recomendaciones && rest_api.recomendaciones.length > 0){
                /* Uso del método id para subdocumentos, tiene que haber un campo _id en ellos */
                recomendacion = rest_api.recomendaciones.id(req.params.recomendacionid);
                if (!recomendacion){
                    sendJsonResponse(res, 404, {
                        "mensaje": "Recomendación no encontrada"
                    });
                } else {
                    response = {
                      rest_api : {
                        nombre : rest_api.nombre,
                        id : req.params.rest_apiid
                      },
                      recomendacion : recomendacion
                    };
                  sendJsonResponse(res, 200, response);
                }
            } else {
                sendJsonResponse(res, 404, {
                    "mensaje": "No se encontraron recomendaciones"
                });
            }          
          });
    } else {
            sendJsonResponse (res, 404, {
                "mensaje": "No hay Api o Recomendación en request"
            });              
    }
};

module.exports.recomendacionesActualizarUno = function (req, res) {
    if (!req.params.rest_apiid || !req.params.reviewid){
        sendJsonResponse(res, 404, {"mensaje": "Se requieren rest_apiid y recomendacionid"});
        return;
    }
    Rest
        .findById(req.params.rest_apiid)
        .select('recomendaciones')
        .exec(
            function(err, rest_api){
                var estaRecomendacion;
                if (!rest_api){
                    sendJsonResponse(res, 404, {"mensaje": "No se encuentra la Api"});
                    return;
                } else if (err){
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (rest_api.recomendaciones && rest_api.recomendaciones.length > 0){
                    estaRecomendacion = rest_api.recomendaciones.id(req.params.recomendacionid);
                    if (!estaRecomendacion){
                        sendJsonResponse(res, 404, {"mensaje": "Recomendación no encontrada"});
                    } else {
                        estaRecomendacion.autor = req.body.autor;
                        estaRecomendacion.puntuacion = req.body.puntuacion;
                        estaRecomendacion.comentario = req.body.comentario;
                        rest_api.save(function(err, rest_api){
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                actualizarPuntuacion(rest_apiid);
                                sendJsonResponse(res, 200, estaRecomendacion);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {"mensaje": "No hay review para actualizar"});
                }
            }
        );
};

var actualizarPuntuacion = function(rest_apiid){
    Rest
        .findById(rest_apiid)
        .select('puntuacion recomendaciones')
        .exec(
            function(err, rest_api){
                if (!err){
                    actPuntuacion(rest_api);
                }
            }
        );
};

var actPuntuacion = function(rest_api){
    var i, numeroRecomendaciones, media, total;
    if (rest_api.recomendaciones && rest_api.recomendaciones.length > 0){
        numeroRecomendaciones = rest_api.recomendaciones.length;
        media = 0;
        total = 0;
        for (i=0; i < numeroRecomendaciones; i++){
            total = total + parseInt(rest_api.recomendaciones[i].puntuacion);
        };
        media = parseInt(total / numeroRecomendaciones, 10);
        rest_api.puntuacion = media;
        rest_api.save (function (err){
            if (err) {
                console.log(err);
            } else {
                console.log("Media de la puntuación actualizada a ", media);
            }
        });
    }
};
    

module.exports.recomendacionesBorrarUno = function (req, res) {
    if (!req.params.rest_apiid || !req.params.recomendacionid) {
        sendJsonResponse(res, 404, {"mensaje": "Se requieren Api y recomendación"});
        return;
    }
    Rest
        .findById(req.params.rest_apiid)
        .select('recomendaciones')
        .exec(
            function(err, rest_api) {
                if (!rest_api) {
                    sendJsonResponse(res, 404, {"mensaje":"Api no encontrada"});
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (rest_api.recomendaciones && rest_api.recomendaciones.length > 0) {
                    if (!rest_api.recomendaciones.id(req.params.recomendacionid)) {
                        sendJsonResponse(res, 404, {"mensaje": "Recomendación no encontrada"});
                    } else {
                        rest_api.recomendaciones.id(req.params.recomendacionid).remove();
                        rest_api.save(function(err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                actualizarPuntuacion(rest_api._id);
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {"mensaje": "No hay recomendación que borrar"});
                }
            }
        );
};

