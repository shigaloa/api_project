var request = require ('request');

var datos_grafico;



var apiOptions = {
  server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://evening-refuge-67640.herokuapp.com";
}

/* GET página listado de APIS */

module.exports.apiList = function(req, res){
    var requestOptions, path;
    path = '/api/rest_apis';
    requestOptions = {
      url: apiOptions.server + path,
      method: "GET",
      json: {},
    };
    
    request(
      requestOptions,
      function(err, response, body){
        renderApiList (req, res, body);
      }
    );
}

var renderApiList = function (req, res, responseBody) {
    var mensaje;
    if (!(responseBody instanceof Array)) {
        mensaje = "Error en la Api";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            mensaje = "No hay Apis";
        }
    };
    listaApis = responseBody;
    res.render('lista-apis', {
        titulo: 'Lista de APIs',
        cabecera: {
            titulo: 'APIs disponibles',
            subtitulo: 'Escoge la API'
        },
        listaApis:listaApis,
        mensaje: mensaje
    });
};

// función para obtener los datos de la Api
// p.e. la utilizo en renderRecomendacion

var getApiInfo = function(req, res, callback){   
    var requestOptions, path;
    path = "/api/rest_apis/" + req.params.rest_apiid;
    requestOptions = {
      url : apiOptions.server + path,
      method : "GET",
      json : {}
    };
    request(
      requestOptions,
      function(err, response, body){
        var data = body;
        if (response.statusCode ===200) {
          callback(req, res, data);      
        } else {
            _showError(req, res, response.statusCode);
        }
      }
    );
  };

/* Redirige a la función de la Api correspondiente*/

module.exports.apiInfo = function(req, res,){
    getApiInfo(req, res, function(req, res, responseData){
        console.log ('info: ', responseData);
        var apiData = responseData;
        switch(apiData.api) {
            case 'INE':
                apiIneInfo (req, res, apiData);
                break;
            case 'ARAGON':
                apiAragonInfo (req, res, apiData);
                break;
            case 'NASA':
                apiNasaInfo (req, res, apiData);
                break;
        }
    });
};

/* Redirige a la función correspondiente*/

module.exports.postApiInfo  = function(req, res,){
    getApiInfo(req, res, function(req, res, responseData){
        console.log ('info: ', responseData);
        var apiData = responseData;
        switch(apiData.api) {
            case 'INE':
                postApiIneInfo (req, res, apiData);
                break;
            case 'ARAGON':
                postApiAragonInfo (req, res, apiData);
                break;
            case 'NASA':
                postApiNasaInfo (req, res, apiData);
                break;
        }
    });
};

var apiIneInfo = function (req, res, apiData) {
    var requestOptions, path;
    servidor = 'http://servicios.ine.es/wstempus/js/ES';
    // Obtener valores variable Comunidad Autónoma
    path = '/VALORES_VARIABLEOPERACION/70/CP';
    requestOptions = {
      url: servidor + path,
      method: "GET",
      json: {},
    };
    
    request(
      requestOptions,
      function(err, response, body){
        if (response.statusCode === 200) {
            segundo_request (req, res, body, apiData);
            control1= body
        } else {
            _showError(req, res, response.statusCode);
        };
      }
    );
};

var segundo_request = function (req, res, control1, apiData) {
    // Obtener valores variable Sexo
    path = '/VALORES_VARIABLEOPERACION/18/CP';
    requestOptions = {
        url: servidor + path,
        method: "GET",
        json: {},
    };

    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 200) {
                controles = {
                    control1: control1,
                    control2: body,
                    apiData: apiData,
                };
                renderDetalleApiIne(req, res, controles);
                } else {
                _showError(req, res, response.statusCode);
            };
        }
    );
};

var renderDetalleApiIne = function (req, res, responseBody) {
    res.render('detalle-api-ine', {
        titulo: 'Api INE',
        cabecera: {
            titulo: '',
            subtitulo: ''
        },
        imagen: {
            cabecera: responseBody.apiData.nombre,
            descripcion: {
                linea1: '',
                linea2: ''
            },
            pie: '',
            puntuacion: responseBody.apiData.puntuacion
        },
        formulario: {
            cabecera: 'Población por sexo y comunidad',
            descripcion: {
                linea1: responseBody.apiData.imagen,
                linea2: responseBody.apiData.linea2
            },
            pie: ''
        },
        listaApis:listaApis,
        comunidades: responseBody.control1,
        sexos: responseBody.control2,
        recomendaciones: responseBody.apiData.recomendaciones,
        rest_api: req.params.rest_apiid // para tener acceso a _id en jade, o p.e. x: :responseBody._id
    });
};

/* POST página de detalle de API INE*/

var postApiIneInfo = function (req, res, apiData) {
    var requestOptions, path;
    var rest_apiid = req.params.rest_apiid;
    postdata = {
        comunidad: req.body.control1,
        sexo: req.body.control2,
        periodos: req.body.periodos
      };
    servidor = 'http://servicios.ine.es/wstempus/js/ES';
    path = '/DATOS_METADATAOPERACION/CP?' +
            'g1=' + '70:' + postdata.comunidad + 
            '&g2=' + '18:' + postdata.sexo +
            '&g3=356:15668' +                   // Todas las edades
            '&g4=141:16420' +                   // Todas las nacionalidades
            '&p=12' + 
            '&nult=' + postdata.periodos;
    console.log('path', path);
    //path = '/VALORES_VARIABLEOPERACION/70/IAS';
    requestOptions = {
      url: servidor + path,
      method: "GET",
      json: {},
    };
    
    if (!postdata.comunidad){
      res.redirect('/rest_api/' + rest_apiid);
    } else {
      request(
        requestOptions,
        function(err, response, body){
          if (response.statusCode === 200){
            console.log('erbody: ', body);
            datos_grafico = body;
            renderGraficoApi(req, res, body, apiData)
          } else {
            _showError(req, res, response.statusCode);
          }
        }
      );
    }
};

var renderGraficoApi = function (req, res, responseBody, apiData) {
    res.render('resultado-ine-api', {
        titulo: 'Api INE',                     //responseBody.nombre,
        resultado: responseBody,
        cabecera: { 
            titulo: apiData.nombre,     //responseBody[0].Nombre.split(".")[0],
            subtitulo: ''
        },
        recomendaciones: '',            //responseBody.recomendaciones,
        listaApis:listaApis,
        rest_apiid: apiData._id         // para tener acceso a _id en jade, o p.e. x: :responseBody._id
    });
};

module.exports.getDatosGrafico = function (req, res) {
    res.json(datos_grafico);
};

/* 

            ARAGON

*/

var apiAragonInfo = function (req, res, apiData) {
    controles= {
        tipos:[
            'event',
            'text', 
            'wiki', 
            'video', 
            'picture', 
            'venue', 
            'code', 
            'media'
        ],
        fuentes: [
            'spain_info',
            'facebook_events',
            'twitter',
            'youtube',
            'instagram',
            'facebook',
            'wikipedia',
            'blogger',
            'wordpress',
            'blogia',
            'vimeo',
            'flickr',
            'foursquare',
            'pinterest',
            'google_plus',
            'github',
            'heraldodearagon',
            'periodicodearagon',
            'diariodelaltoaragon',
            'diariodeteruel'
        ],
        opciones: [
            {
                etiqueta: 'Tipo de contenido',
                valor: 'type'
            },
            {
                etiqueta: 'Fuente de datos',
                valor: 'source'
            },
            {
                etiqueta: 'Datos cercanos al usuario',
                valor: 'center'
            }
        ],
        apiData: apiData
    };
    renderDetalleApiAragon (req, res, controles);
};

var renderDetalleApiAragon = function (req, res, responseBody) {
    res.render('detalle-api-aragon', {
        titulo: 'Api Aragón Open Data',
        cabecera: {
            titulo: '',
            subtitulo: ''
        },
        imagen: {
            cabecera: responseBody.apiData.nombre,
            descripcion: {
                linea1: '',
                linea2: '',
            },
            pie: '',
            puntuacion: responseBody.apiData.puntuacion
        },
        formulario: {
            cabecera: 'Datos de redes sociales',
            descripcion: {
                linea1: responseBody.apiData.imagen,
                linea2: responseBody.apiData.linea2
            },
            pie: ''
        },
        seleccion: responseBody.opciones,
        tipos: responseBody.tipos,
        fuentes: responseBody.fuentes,
        centro: responseBody.center,
        recomendaciones: responseBody.apiData.recomendaciones,
        listaApis:listaApis,
        rest_api: req.params.rest_apiid // para tener acceso a _id en jade, o p.e. x: :responseBody._id
    });
};

/* POST página de detalle de API ARAGON */

var postApiAragonInfo = function (req, res, apiData) {
    
    var requestOptions, path;
    var rest_apiid = req.params.rest_apiid;
    var postdata = {
        seleccion: req.body.seleccion,
        tipo: req.body.tipo,
        fuente: req.body.fuente,
        centrar: req.body.centrar,
        latitud: req.body.latitud,
        longitud: req.body.longitud
        };

    var valor;

    if (postdata.seleccion == 'type') {
        valor = postdata.tipo;
    } else if (postdata.seleccion == 'source') {
        valor = postdata.fuente;
    } else if (postdata.seleccion == 'center') {
        valor = postdata.latitud + ',' + postdata.longitud + '&distance=' + postdata.centrar;
    };
    
    servidor = 'https://opendata.aragon.es/socialdata/data';
    path = '?' +
            postdata.seleccion + 
            '=' +
            valor;
    console.log('path', path);
    requestOptions = {
      url: servidor + path,
      method: "GET",
      json: {},
    };
    
    if (!postdata.seleccion || !valor){
      res.redirect('/rest_api/' + rest_apiid);
    } else {
      request(
        requestOptions,
        function(err, response, body){
          if (response.statusCode === 200){
            renderAragonApi(req, res, body, apiData)
          } else {
            _showError(req, res, response.statusCode);
          }
        }
      );
    }
};

var renderAragonApi = function (req, res, responseBody, apiData) {
    if (responseBody.status = 'OK'){
        res.render('resultado-aragon-api', {
            titulo: 'Api Aragón Open Data',
            resultados: responseBody.results,
            cabecera: { 
                titulo: apiData.nombre,
                subtitulo: ''
            },
            recomendaciones: '',
            listaApis:listaApis,
            rest_apiid: apiData._id // para tener acceso a _id en jade, o p.e. x: :responseBody._id
        });
    } else if (responseBody.status = 'NOK'){
        console.log ('No hay resultados en la Api Aragón');
    } 
};

/* 

            NASA

*/

var apiNasaInfo = function (req, res, apiData) {
    controles= {
        rovers:[
            {nombre: 'Curiosity', camaras: [0, 1, 2, 3, 4, 5, 6]},
            {nombre: 'Opportunity', camaras: [0, 1, 6, 7, 8]},
            {nombre: 'Spirit', camaras: [0, 1, 6, 7, 8]}
        ],
        camara_set1:[
            {abreviatura: 'FHAZ', nombre: 'Front Hazard Avoidance Camera'},
            {abreviatura: 'RHAZ', nombre: 'Rear Hazard Avoidance Camera'},
            {abreviatura: 'MAST', nombre: 'Mast Camera'},
            {abreviatura: 'CHEMCAM', nombre: 'Chemistry and Camera Complex'},
            {abreviatura: 'MAHLI', nombre: 'Mars Hand Lens Imager'},
            {abreviatura: 'MARDI', nombre: 'Mars Descent Imager'},
            {abreviatura: 'NAVCAM', nombre: 'Navigation Camera'}
        ],
        camara_set2:[
            {abreviatura: 'FHAZ', nombre: 'Front Hazard Avoidance Camera'},
            {abreviatura: 'RHAZ', nombre: 'Rear Hazard Avoidance Camera'},
            {abreviatura: 'NAVCAM', nombre: 'Navigation Camera'},
            {abreviatura: 'PANCAM', nombre: 'Panoramic Camera'},
            {abreviatura: 'MINITES', nombre: 'Miniature Thermal Emission Spectrometer'}
        ],
        apiData: apiData
    };
    renderDetalleApiNasa (req, res, controles);
};

var renderDetalleApiNasa = function (req, res, responseBody) {
    res.render('detalle-api-nasa', {
        titulo: 'Api NASA',
        cabecera: {
            titulo: '',
            subtitulo: ''
        },
        imagen: {
            cabecera: responseBody.apiData.nombre,
            descripcion: {
                linea1: '',
                linea2: '',
            },
            pie: '',
            puntuacion: responseBody.apiData.puntuacion
        },
        formulario: {
            cabecera: 'Fotos por Rover, cámara y día',
            descripcion: {
                linea1: responseBody.apiData.imagen,
                linea2: responseBody.apiData.linea2
            },
            pie: ''
        },
        rovers: responseBody.rovers,
        camara_set1: responseBody.camara_set1,
        camara_set2: responseBody.camara_set2,
        recomendaciones: responseBody.apiData.recomendaciones,
        listaApis:listaApis,
        rest_api: req.params.rest_apiid // para tener acceso a _id en jade, o p.e. x: :responseBody._id
    });
};

/* POST página de detalle de API NASA */

var postApiNasaInfo = function (req, res, apiData) {
       
    var requestOptions, path;
    var rest_apiid = req.params.rest_apiid;
    var camara;

    if (req.body.camara_set1) {
        camara = req.body.camara_set1;
    } else {
        camara = req.body.camara_set2;
    };

    var postdata = {
        rover: req.body.rover,
        camara: camara,
        sol: req.body.sol,
        api_key : 'OQFS2VMIAbziDemptL3TohOB5FHghLo6pyGou5K7' // Proporcionada por NASA
        };

    servidor = 'https://api.nasa.gov/mars-photos/api/v1';
    path = '/rovers/' +
            postdata.rover + 
            '/photos?' +
            'sol=' + postdata.sol +
            '&camera=' + postdata.camara +
            '&api_key=' + postdata.api_key;
    console.log('path', path);
    requestOptions = {
      url: servidor + path,
      method: "GET",
      json: {},
    };
    
    if (!postdata.rover || !postdata.camara || !postdata.sol){
      res.redirect('/rest_api/' + rest_apiid);
    } else {
      request(
        requestOptions,
        function(err, response, body){
          if (response.statusCode === 200){
            renderNasaApi(req, res, body, apiData)
          } else {
            _showError(req, res, response.statusCode);
          }
        }
      );
    }
};

var renderNasaApi = function (req, res, responseBody, apiData) {
    console.log(responseBody);
    console.log(apiData);
    res.render('resultado-nasa-api', {
        titulo: 'Api NASA',
        resultado: responseBody,
        cabecera: { 
            titulo: apiData.nombre,
            subtitulo: ''
        },
        recomendaciones: '',
        listaApis:listaApis,
        rest_apiid: apiData._id // para tener acceso a _id en jade, o p.e. x: :responseBody._id
    });
};

/* GET página de recomendación de API */

module.exports.getRecomendacion = function (req, res) {
    getApiInfo (req, res, function (req, res, response){
        renderRecomendacion (req, res, response);
    });
};

var renderRecomendacion = function (req, res, detalleApì) {
    res.render('recomendacion', { 
        titulo: 'Añadir recomendación',
        cabecera: 'Recomendar ' + detalleApì.nombre,
        error: req.query.err,
        listaApis:listaApis
    });
};

/* POST página de recomendación de API */
module.exports.postRecomendacion = function (req, res) {
    var requestOptions, path, rest_apiid, postdata;
    rest_apiid = req.params.rest_apiid;
    path = "/api/rest_apis/" + rest_apiid + '/recomendaciones';
    postdata = {
      autor: req.body.nombre,
      puntuacion: parseInt(req.body.puntuacion, 10),
      comentario: req.body.comentario
    };
    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    /* descomentar lo siguiente para evitar hacer llamadas innecesarias a la bd si no se rellenan
    todos los campos. También se ha previsto más adelante en este módulo, con status 400, pero en ese
    caso ya se ha llamado a la bd y esta comprueba que es una violación de requerimientos  de esquema.
    También podemos hacer una comprobación en el browser con validation.js (en public/javascripts
    y evitar también la llamada al servidor*/
    /*if (!postdata.autor || !postdata.puntuacion || !postdata.comentario){
      res.redirect('/rest_api/' + rest_apiid + '/recomendacion/nueva');
    } else {*/
      request(
        requestOptions,
        function(err, response, body){
          if (response.statusCode === 201){
              res.redirect('/rest_api/' + rest_apiid);
          } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
              // error en la función save de la Api, devuelve status 400
              res.redirect('/rest_api/' + rest_apiid + '/recomendacion/nueva?err=val')
          } else {
              console.log(body);
              _showError(req, res, response.statusCode);
          }
        }
      );
    //}
};

var _showError = function (req, res, status) {
    var titulo, contenido;
    if (status === 404) {
      titulo = "404, no se encuentra la página";
      contenido = "No podemos encontrar la página, lo sentimos";
    } else {
      titulo = status + ", algo ha ido mal";
      contenido = "En algún sitio hay algo mal. No es un error 404";
    }
    res.status(status);
    res.render('texto-generico', {
      titulo : titulo,
      contenido : contenido
      });
};
