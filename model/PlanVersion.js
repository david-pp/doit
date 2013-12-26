var Util = require('util');
var mysql = require('../db');
var DBHelper = require('./DBHelper');

function PlanVersion(properties) {
	if (arguments.length == 1) {
		for (var i in properties) {
			this[i] = properties[i];
		}
	}
}

// 版本类型
PlanVersion.category = {
	invalid   : 0,	// 未知
	single    : 1,  // 单区
	multizone : 2,  // 大区
	allzone   : 3,  // 全区
};

// 版本状态
PlanVersion.status = {
	created   	   : 0,  // 刚创建
	debug_test     : 1,  // 内网测试中
	release_test   : 2,  // 外网测试中
	passed         : 3,  // 版本结束
};

PlanVersion.db = new DBHelper({
		table: 'plan_version',
		key:'id',
		auto_increment : true,
		fields: [
			{ name:'id', type:'int(10)', default: 1},                          // 编号
			{ name:'desc', type:'varchar(256)', default: ''},                  // 描述
			{ name:'status', type:'int(10)', default: 0},                      // 状态
			{ name:'category', type:'int(10)', default: 0},                    // 分类
			{ name:'time_create', type:'int(10)', default: 0},                 // 创建时间
			{ name:'time_make', type:'int(10)', default: 0},                   // 版本时间           
			{ name:'time_release', type:'int(10)', default: 0},                // 发布时间
		]
	});


module.exports = PlanVersion;
