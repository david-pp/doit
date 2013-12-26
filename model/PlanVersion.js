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

PlanVersion.db = new DBHelper({
		table: 'plan_version',
		key:'id',
		auto_increment : true,
		fields: [
			{ name:'id', type:'int(10)', default: 1},                          // 编号
			{ name:'desc', type:'varchar(256)', default: ''},                  // 描述
			{ name:'status', type:'int(10)', default: 0},                    // 状态
			{ name:'category', type:'int(10)', default: 0},                    // 分类
			{ name:'time_create', type:'int(10)', default: 0},                 // 创建时间
			{ name:'time_make', type:'int(10)', default: 0},                   // 版本时间           
			{ name:'time_release', type:'int(10)', default: 0},                // 发布时间
		]
	});


module.exports = PlanVersion;
