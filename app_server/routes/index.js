var express = require('express');
var router = express.Router();
var ctrlRest_apis = require('../controllers/rest_apis');
var ctrlOtros = require('../controllers/otros');

/* Páginas de APIs. */
router.get('/', ctrlRest_apis.apiList);
router.get('/rest_api/:rest_apiid', ctrlRest_apis.apiInfo);
router.post('/rest_api/:rest_apiid', ctrlRest_apis.postApiInfo);
router.get('/rest_api/:rest_apiid/recomendacion/nueva', ctrlRest_apis.getRecomendacion);
router.post('/rest_api/:rest_apiid/recomendacion/nueva', ctrlRest_apis.postRecomendacion);

/* Página de gráficos */
router.get('/datos_grafico', ctrlRest_apis.getDatosGrafico);

/* Otras páginas */
router.get('/about', ctrlOtros.about);
router.get('/cv', ctrlOtros.cv);
router.get('/contacto', ctrlOtros.contacto);
router.post('/contacto', ctrlOtros.postContacto);


module.exports = router;
