var redis = require('./../db');
var User = require('../model/User');
var Task = require('../model/Task');


// 页面：主页
exports.index = function(req, res){
  res.render('index', { title: 'DoIt !' });
  console.log(req.session);
};

// 页面：任务
exports.tasklist = function(req, res){
  res.render('tasks', { title: 'DoIt !', status : req.query.status});
};

// 页面：Gantt图
exports.gantt = function(req, res){
  res.render('gantt', { title: Task.status2text(parseInt(req.query.status)), status: req.query.status});
}

// 页面：登录
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

exports.admin_user = function(req, res) {
  res.render('admin_user', { title: "用户管理"});
}


exports.ajax_userlist = function(req, res) {
  User.db.select(null, 'order by `group`, `id`', function(err, results) {
    console.log(results);
    res.json(results);
  });
}

exports.ajax_setuser = function(req, res) {

}

exports.ajax_deluser = function(req, res) {
}


exports.ajax_tasklist = function(req, res) {
  console.log(req.query);

  if (req.query.status) {
    Task.db.select(null, 'where `status`='+ req.query.status, function(err, results){
      res.json(results);
      console.log(results);
    });
  } else {
     Task.db.select(null, null, function(err, results){
      console.log(results);
      res.json(results);
    });
  }
}

exports.task = function(req, res) {
  console.log(req.params.task);
  console.log(req.params);
}
