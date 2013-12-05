var redis = require('./../db');
var User = require('./../user')


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DoIt !' });
  console.log(req.session);
};


exports.login = function (req, res) {
  res.render('login', { title: "登录"});
}

exports.doLogin = function(req, res){
	console.log(req.body);
  User.authenticate(req.body.username, req.body.userpasswd, function(err, user){
    if (err)
    {
      res.render('login', { title: "登录", errmsg:err});
      console.log(err);
    }
    else
    {
      if (user) {
        req.session.regenerate(function(){
          req.session.user = user;
          res.redirect('/');
        });
      }
      else
      {
        res.redirect('/');
      }
    }
  });


}

exports.logout = function(req, res){
  
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
    });
}

exports.user = function(req, res) {
  console.log(req.params.user);
  console.log(req.params);
  redis.set('user', req.params.user);
}