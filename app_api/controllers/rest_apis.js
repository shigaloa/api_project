var mongoose = require('mongoose');
var Rest = mongoose.model('Rest_api');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.rest_apisListar = function (req, res) {
    Rest
        .find()        
        .exec(function(err,rest_apis){          
          if (!rest_apis){
              sendJsonResponse(res, 404, {
                  "mensaje": "No hay Apis"
              });
              return;
          } else if (err) {
              sendJsonResponse(res, 404, err);
              return;
          }; 
          sendJsonResponse(res, 200, rest_apis);                
        });
};

// Desarrollar si se necesitara.
module.exports.rest_apisCrear = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.rest_apisLeerUno = function (req, res) {
    if (req.params && req.params.rest_apiid){
        Rest
            .findById(req.params.rest_apiid)
            .exec(function(err, rest_api) {
                if (!rest_api) {
                    sendJsonResponse(res, 404, {
                    "mensaje": "Api no encontrada"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, rest_api);
            });
    } else {
        sendJsonResponse(res, 404, {
        "mensaje": "No hay Api en request"
        });
    }
};

// Desarrollar si se necesitara.
module.exports.rest_apisActualizarUno = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

// Desarrollar si se necesitara.
module.exports.rest_apisBorrarUno = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};
