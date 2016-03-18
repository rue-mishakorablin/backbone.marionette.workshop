var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    compression = require('compression'),
    errorHandler = require('errorhandler');
    passport = require('passport'),
    less = require('less-middleware'),
    exphbs  = require('express-handlebars');

http.globalAgent.maxSockets = 100;

var app = express();

// // http://stackoverflow.com/q/11001817/567135
// var allowCrossDomain = function(req, res, next) {
//     // res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//         res.send(200);
//     }
//     else {
//         next();
//     }
// };

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.disable('x-powered-by');
var cookieSettings = {
    path: '/',
    httpOnly: true
};

app.set('port', process.env.PORT || 8080);
app.use(cookieParser());
app.use(bodyParser({limit: '50mb'}));
app.use(methodOverride());
app.use(session({
    secret: "noneofyourbusiness",
    cookie: cookieSettings
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(allowCrossDomain);
app.use(compression());
app.use(errorHandler());

app.use(less('stylesheets', {
  pathRoot: __dirname,
  dest: 'public',
  force: true,
  debug: true,
  preprocess: {
    path: function(src) { 
      return src.replace(/\/css/, ''); 
    }
  },
  render: {
    compress: true
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

require("./api")(app);

app.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect(302, '/me');
    } else {
        res.render('login');
    }
});

app.get('/register', function(req, res) {
    res.render('register');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
