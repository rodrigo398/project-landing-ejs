var empresasController = require('../controller/empresas_controller');
var personasController = require('../controller/personas_controller');
var datosformController = require('../controller/datosform_controller');
var fs = require('fs');
const decrypt = require('../utils/decrypt');
const isLoggedIn = require('../middleware/checkCookie').isLoggedIn;

module.exports = function(app) {
  app.get('/', (req, res) => {
    res.render('pages/index');
  });

  app.get('/login', (req, res) => {
    res.render('pages/login');
  });

  app.get('/persona/([^/]+)-t:webid', isLoggedIn, (req, res) => {
    personasController.getPersonaId(req.params.webid, (err, persona) => {
      if (persona) {
        res.render('pages/ficha', {
          islogin: req.params.islogin,
          persona: persona,
          fs: fs
        });
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/empresa/([^/]+)-t:webid', isLoggedIn, (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    empresasController.getEmpresaId(req.params.webid, (err, results) => {
      if (results) {
        res.render('pages/empresa', {
          islogin: req.params.islogin,
          data: results,
          fs: fs,
          urlfull: fullUrl
        });
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('landing');
    res.clearCookie('logd');
    res.redirect('back');
  });

  app.get('/register', (req, res) => {
    res.render('pages/register');
  });

  app.get('/recuperar-contrasena', (req, res) => {
    res.render('pages/forgot-password');
  });

  app.get('/buscar', (req, res) => {
    if (req.query.publicacion != undefined) {
      datosformController.buscarPorPublicacion(
        req.query.publicacion,
        (err, resultados) => {
          if (resultados) {
            res.render('pages/tables', {
              matches: resultados,
              matchesPersonas: [],
              fs: fs,
              parametroBusqueda: req.query.busqueda
            });
          }
        }
      );
    } else if (req.query.busqueda != undefined) {
      empresasController.encontrarQuery(
        req.query.busqueda,
        (err, resultados) => {
          if (resultados) {
            personasController.buscarQuery(
              req.query.busqueda,
              (err, resultadoPersona) => {
                if (err) {
                  res.render('pages/tables', { matches: resultados, fs: fs });
                }
                if (resultadoPersona) {
                  res.render('pages/tables', {
                    matches: resultados,
                    matchesPersonas: resultadoPersona,
                    fs: fs,
                    parametroBusqueda: req.query.busqueda
                  });
                }
              }
            );
          } else {
            // console.log('test');
          }
        }
      );
    } else {
      res.redirect('/');
    }
  });

  app.post('/api/users', (req, res) => {
    const myToken = req.body.token;
    res.cookie('qesq', myToken, {
      maxAge: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      httpOnly: false
    });
    const decryptToken = JSON.parse(decrypt.decryptToken(myToken));
    const cookieLogd = 'webUser/' + decryptToken.email;
    res.cookie('logd', cookieLogd, {
      maxAge: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      httpOnly: false
    });
    res.send(decryptToken);
    //definir cookie para check de middleware
  });

  app.get('/api/getuser', (req, res) => {
    const myToken = req.cookies.qesq;
    const decryptToken = JSON.parse(decrypt.decryptToken(myToken));
    res.send(decryptToken);
  });
};
