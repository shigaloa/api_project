var nodemailer = require ('nodemailer');

// GET página About
module.exports.about = function(req, res){
    res.render('about', {
        titulo: 'Sobre la Web',
        cabecera: 'SOBRE LA WEB',
        contenido1: '',
        contenido2: ''
    });
};

// GET página Curriculum
module.exports.cv = function(req, res){
    res.render('cv', {
        titulo: 'Curriculum',
        cabecera: 'Curriculum',
        contenido1: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque consequuntur excepturi numquam\
          deleniti adipisci doloribus assumenda ut quia, similique quas expedita officiis eos quibusdam magnam reprehenderit minus\
          non soluta esse.',
        contenido2: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati ea fugiat deleniti itaque repellendus\
          enim minus inventore, praesentium excepturi magni voluptatibus natus possimus, maxime rerum laborum in\
          vel.'
    });
};

// GET página Contacto
module.exports.contacto = function(req, res){
  res.render('contacto', {
      titulo: 'Contacto',
      cabecera: 'Contacto',
      contenido1: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque consequuntur excepturi numquam\
        deleniti adipisci doloribus assumenda ut quia, similique quas expedita officiis eos quibusdam magnam reprehenderit minus\
        non soluta esse.',
      contenido2: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati ea fugiat deleniti itaque repellendus\
        enim minus inventore, praesentium excepturi magni voluptatibus natus possimus, maxime rerum laborum in\
        vel.'
  });
};

// POST página Contacto
module.exports.postContacto = function(req, res){
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'cpanel06.myhostcenter.com',
    port: 465,
    secure: true,
    auth: {
      user: 'api_project@dhvirtual.com',    // poner como variable de entorno node por seguridad
      pass: 'api_project1966'
    }
  });
  mailOpts = {
    from: req.body.email,
    to: 'api_project@dhvirtual.com',        
    subject: 'Mensaje de ' + req.body.nombre + ' desde ApiProject',
    text: req.body.comentario
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      console.log('contacto-error');
    } else {
      console.log('contacto-exito ',response);
      res.redirect('/');
    }
  });
};