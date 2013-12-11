var Util = require('util');
var mysql = require('../db');
var DBHelper = require('./DBHelper');

module.exports = User;

function User(properties) {
	if (arguments.length == 1) {
		for (var i in properties) {
			this[i] = properties[i];
		}
	}
}

User.db = new DBHelper({
		table: 'user',
		key:'id',
		auto_increment : true,
		fields: [
			{ name:'id', type:'int(10)', default: 0},
			{ name:'name', type:'varchar(32)', default: ''},
			{ name:'passwd', type:'varchar(64)', default: ''},
			{ name:'group', type:'int(10)', default: 0}
		]
	});

User.authenticate = function (name, pass, fn) {

	User.db.loadWhere('name = \''+ name + '\' AND passwd = \'' + pass + '\'', function(err, results){
		if (results.length > 0)
		{
			fn(null, new User(results[0]));
		}
		else
		{
			fn(new Error('用户名或密码错误！'))
		}
	});
}


function test() {
	var u = new User({id:1, name:'david'});
	console.log(u);
	User.db.insert(u);
}

//test();