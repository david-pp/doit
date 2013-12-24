var Util = require('util');
var mysql = require('../db');
var DBHelper = require('./DBHelper');

function PlanTasks(properties) {
	if (arguments.length == 1) {
		for (var i in properties) {
			this[i] = properties[i];
		}
	}
}

PlanTasks.db = new DBHelper({
		table: 'plan_tasks',
		key:null,
		auto_increment : false,
		fields: [
			{ name:'vid', type:'int(10)', default: 0},                 // 版本编号
			{ name:'tid', type:'int(10)', default: 0},                 // 单号
		]
	});


module.exports = PlanTasks;
