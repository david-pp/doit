var Util = require('util');
var mysql = require('../db');
var DBHelper = require('./DBHelper');

module.exports = Task;

function Task(properties) {
	if (arguments.length == 1) {
		for (var i in properties) {
			this[i] = properties[i];
		}
	}
}

// 任务分类
Task.category = { 
	unkown : 0,
	func   : 1,            // 新功能
	optimi_inner : 2,      // 内网优化
	optimi_outer : 3,      // 外网优化
	bug_inner : 4,         // 内网BUG
	bug_outer : 5,         // 外网BUG
};

// 任务优先级
Task.priority = {
	A : 1,                 // 紧急重要
	B : 2,                 // 紧急不重要
	C : 3,                 // 重要不紧急
	D : 4,                 // 不重要不紧急
};

// 任务状态
Task.status = {
	none : 0,
	created : 1,           // 未开始执行
	coding  : 2,           // 编码中...
	cotest  : 3,           // 联调中...
	qatest  : 4,           // 内网测试中...
	passed  : 5,           // 内网版本测试通过
	released: 6,           // 发布/外网版本测试通过

};

Task.db = new DBHelper({
		table: 'task',
		key:'id',
		auto_increment : true,
		fields: [
			{ name:'id', type:'int(10)', default: 0},                          // 单号
			{ name:'desc', type:'varchar(256)', default: ''},                  // 任务描述
			{ name:'category', type:'int(10)', default: 0},                    // 任务分类
			{ name:'priority', type:'int(10)', default: 0},                    // 任务优先级
			{ name:'status', type:'int(10)', default: 0},                      // 任务状态
			{ name:'designer', type:'varchar(32)', default: 0},                // 负责人-策划
			{ name:'client', type:'varchar(256)', default: 0},                 // 负责人-客户端程序
			{ name:'server', type:'varchar(256)', default: 0},                 // 负责人-服务器程序
			{ name:'qa', type:'varchar(256)', default: 0},                     // 负责人-QA    
			{ name:'createtime', type:'int(10)', default: 0},                  // 创建时间              
			{ name:'plan_clienttime', type:'int(10)', default: 0},             // 计划编码用时/days
			{ name:'plan_servertime', type:'int(10)', default: 0},             // 计划编码用时/days
			{ name:'plan_cotesttime', type:'int(10)', default: 0},             // 计划联调用时/days
			{ name:'plan_qatesttime', type:'int(10)', default: 0},             // 计划测试用时/days
		]
	});


Task.status2text = function(status) {
  switch(status) {
    case 0:
      return '未知';
    case 1:
      return '尚未开始';
    case 2:
      return '开发编码';
    case 3:
      return '开发联调';
    case 4:
      return '开发测试';
    case 5: 
      return '测试通过';
    case 6:
      return '已经发布';
  }
  return  '未知';
}