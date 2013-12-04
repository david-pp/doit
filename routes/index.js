var redis = require('./../db');


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DoIt !' });
  console.log(req.session);
};

exports.login = function(req, res){
	console.log(req.body);

  console.log("login.....")
	res.redirect('/');

	/*
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation 
      req.session.regenerate(function(){
        // Store the user's primary key 
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('login');
    }
  });
*/
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
  redis.set('user', req.params.user);
}