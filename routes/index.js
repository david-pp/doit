var mysql = require('../db');
var User = require('../model/User');
var Task = require('../model/Task');
var PlanVersion = require('../model/PlanVersion');
var PlanTasks = require('../model/PlanTasks');


// 页面：主页
exports.index = function(req, res){
  res.render('index', { title: 'DoIt !' });
  console.log(req.session);
};

// 页面：任务
exports.tasklist = function(req, res){
  res.render('tasks', { title: 'DoIt !', status : req.query.status});
};

// 页面：任务详情
exports.task = function(req, res) {
  res.render('task', { title: 'task:' + req.params.task});
}

// 页面：Gantt图
exports.gantt = function(req, res){
  res.render('gantt', { title: Task.status2text(parseInt(req.query.status)), status: req.query.status});
}

// 页面：登录
exports.login = function (req, res) {
  res.render('login', { title: "登录"});
}

// 页面：版本计划
exports.planpage = function (req, res) {
  res.render('plans', { title: "版本计划"});
}

// 页面：版本计划
exports.planview = function (req, res) {
  res.render('planview', { title: "版本计划"});
}

// 页面：版本详情
exports.plan = function (req, res) {
  res.render('plan', { title: '版本计划:' + req.params.plan});
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

    var ordertext = 'id desc';
    switch (parseInt(req.query.status)) {
      case Task.status.coding:
        ordertext = 'plan_servertime';
        break;
      case Task.status.cotest:
        ordertext = 'plan_cotesttime';
        break;
      case Task.status.qatest:
        ordertext = 'plan_qatesttime';
        break;
    }

    Task.db.select(null, 'where `status`='+ req.query.status + ' order by ' + ordertext, function(err, results){
      res.json(results);
      //console.log(results);
    });
  } else {
     Task.db.select(null, null, function(err, results){
      //console.log(results);
      res.json(results);
    });
  }
}


// 创建版本
exports.ajax_plan_create = function(req, res) {
  PlanVersion.db.insert(req.query, function(err, results) {
    var ret = new Object();
    if (err) {
      console.log(err);
      ret.errcode = 1;
    }else {
      ret = req.query;
      ret.id = results.insertId;
      ret.errcode = 0;
    }
    res.json(ret);
    //console.log(ret);
  });
}

// 删除版本
exports.ajax_plan_delete = function(req, res) {
  PlanVersion.db.delete('id=' + req.query.id, function(err, results){
    var ret = new Object();
    if (err) {
      console.log(err);
      ret.errcode = 1;
    } else {
      ret = req.query;
      ret.errcode = 0;
    }
    res.json(ret);
  });
}

// 添加单号
exports.ajax_plan_add = function(req, res) {
   PlanTasks.db.insert(req.query, function(err, results) {
    var ret = new Object();
    if (err) {
      console.log(err);
      ret.errcode = 1;
    }else {
      ret = req.query;
      ret.errcode = 0;
    }
    res.json(ret);
    //console.log(ret);
  });
}

// 删除单号
exports.ajax_plan_remove = function(req, res) {
  var ret = new Object();
  ret.errcode = 1;

  var where = null;
  if (req.query.vid)
  {
    if (req.query.tid) {
      where = 'vid=' + req.query.vid + ' and ' + 'tid=' + req.query.tid;
    } else {
      where = 'vid=' + req.query.vid;
    }
  }

  if (where) {
    PlanTasks.db.delete(where, function(err, results){  
      if (err) {
        console.log(err);
        ret.errcode = 2;
      } else {
        ret = req.query;
        ret.errcode = 0;
      }
      res.json(ret);
    });
  } else {
    res.json(ret);
  }
}

// 获得版本信息
exports.ajax_plan_list = function(req, res) {
   PlanVersion.db.select(null, ' order by ' + "time_make desc", function(err, results){
      res.json(results);
      //console.log(results);
    });
}

// 获得版本内容
exports.ajax_plan_tasks = function(req, res) {
  mysql.query('select * from task where id in (select tid from plan_tasks where vid=' + req.query.id + ')', function(err, results){
    res.json(results);
  });
}

