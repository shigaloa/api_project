var mongoose = require( 'mongoose' );
var dbURI = 'mongodb://localhost/Apidb';
var gracefulShutdown;

/*pag. 157 heroku por defecto NODE_ENV production, no en local*/
/*nos vale para decidir que bd tomar, la local o la de MLAB*/
if (process.env.NODE_ENV === 'production'){
    //Poner la dbURI correspondiente cuando se pase a producción
    //dbURI = 'mongodb://shigaloa:fra00mar@ds213229.mlab.com:13229/loc8r-dev';
};

/*para ocultar user/pass hemos puesto variable de entorno en heroku MONGOLAB_URI*/
if (process.env.NODE_ENV === 'production'){
    dbURI = process.env.MONGOLAB_URI;
};

/* deprecado, para asíncronas utilizar catch, versiones mas nuevas de mongoose*/
mongoose.connect(dbURI);

/* para versiones más nuevas de mongoose*/
/*mongoose.connect(dbURI).then(()=>{
    console.log('Mongoose conectado a ' + dbURI);
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful.')    
  });*/

mongoose.connection.on('connected', function (){
    console.log('Mongoose conectado a ' + dbURI);
});
mongoose.connection.on('error', function (err){
      console.log('Mongoose error de conexión: ' + err);
});
 mongoose.connection.on('disconnected', function (){
      console.log('Mongoose desconectado');
});

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close (function (){
        console.log('Mongoose desconectado a través de ' + msg);
        callback();
    });
};

  // Para restarts desde nodemon
process.once('SIGUSR2', function() {
    gracefulShutdown ('Restart desde nodemon', function() {
        process.kill (process.pid, 'SIGUSR2');
    });
});

  // Para terminación desde app
process.on ('SIGINT', function (){
    gracefulShutdown ('Terminación desde app', function() {
        process.exit (0);
    });
});

  // Para terminación desde Heroku
process.on ('SIGTERM', function (){
    gracefulShutdown ('Terminación desde Heroku app', function (){
        process.exit (0);
    });
});

require ('./rest_apis');
//require ('./users');