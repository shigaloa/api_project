var express = require('express');
var router = express.Router();

/*var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
    //requestProperty: 'payload'
});*/
//console.log('en index.js', process.env.JWT_SECRET);

var ctrlRest_Apis = require('../controllers/rest_apis');
var crtlRecomendaciones = require('../controllers/recomendaciones');
//var ctrlAuth = require('../controllers/authentication');

// rest_apis
router.get('/rest_apis', ctrlRest_Apis.rest_apisListar);
router.post('/rest_apis', ctrlRest_Apis.rest_apisCrear);
router.get('/rest_apis/:rest_apiid', ctrlRest_Apis.rest_apisLeerUno);
router.put('/rest_apis/:rest_apiid', ctrlRest_Apis.rest_apisActualizarUno);
router.delete('/rest_apis/:rest_apiid', ctrlRest_Apis.rest_apisBorrarUno);

// recomendaciones
router.post('/rest_apis/:rest_apiid/recomendaciones', crtlRecomendaciones.recomendacionesCrear);
router.get('/rest_apis/:rest_apiid/recomendaciones/:recomendacionid', crtlRecomendaciones.recomendacionesLeerUno);
router.get('/rest_apis/:rest_apiid/recomendaciones/', crtlRecomendaciones.recomendacionesLeerUno);
router.put('/rest_apis/:rest_apiid/recomendaciones/:recomendacionid', crtlRecomendaciones.recomendacionesActualizarUno);
router.delete('rest_apis/:rest_apiid/recomendaciones/:recomendacionid', crtlRecomendaciones.recomendacionesBorrarUno);

// register y login
/*router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);*/

module.exports = router;