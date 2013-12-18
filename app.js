
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var redis = require('./db');
var User = require('./user');
var util = require('util');
var config = require('./config');

console.log(config.mysql_db);

//redis.set('name', 'david david');

//User.get(2);
//var u = new User({id:2, name:'david', password:'123456'});
//u.save();

//u = new User({id:3, name:'王大大', password:'1'});
//u.save();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.locals.project = 'Doit!-ZT2';

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
  app.use(express.methodOverride());

  app.use(function(req, res, next){
    console.log('[%s]: %s %s', req.ip, req.method, req.url);
    //console.log('cookies:' + util.inspect(req.cookies));
    //res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });
    //app.locals.user = req.session.user;

    //console.log(app.locals);

    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// middleware
app.all('*', function(req, res, next) {
  if (req.session.user) 
  {
    app.locals.user = req.session.user;
    req.session._garbage = Date();
    req.session.touch();
  }
  else
  {
    app.locals.user = null;
  }

  app.locals.path = req.path;

  next();
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/u/:user', routes.user);
app.get('/t/:task', routes.task);
app.get('/task', routes.tasklist);
app.get('/admin/user', routes.admin_user);
app.get('/ajax/userlist', routes.ajax_userlist);
app.post('/ajax/setuser', routes.ajax_setuser);
app.get('/ajax/deluser', routes.ajax_deluser);
app.get('/ajax/tasklist', routes.ajax_tasklist);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
