const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
const checkCookie = require('./middleware/checkCookie');
const decrypt = require('./utils/decrypt');
var datosformController = require('./controller/datosform_controller');

var app = express();
var routes = require('./routes/routes');

app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://www.landing.com');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.locals.datosformController = datosformController;

app.use(express.static(__dirname + '/public')); //css y js estatico
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//checkCookie(app);
routes(app);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Escuchando en ', port);
