

var User = require('./model/User.js')
var Task = require('./model/Task.js')

User.db.createTable();
User.db.alterTable();

Task.db.createTable();
Task.db.alterTable();


function test() {

	var i = 1;
	for (; i <= 5; i++) {
		var u = new User({id:i, name:'david'+i, passwd:'123456', group:1, privillege:User.privillege.admin | User.privillege.manager});
		User.db.replace(u);
	}

	for (; i <= 10; i++) {
		var u = new User({id:i, name:'david'+i, passwd:'123456', group:2, privillege:User.privillege.admin | User.privillege.manager});
		User.db.replace(u);
	}

	for (; i <= 20; i++) {
		var u = new User({id:i, name:'david'+i, passwd:'123456', group:3, privillege:User.privillege.admin | User.privillege.manager});
		User.db.replace(u);
	}

	for (; i <= 30; i++) {
		var u = new User({id:i, name:'david'+i, passwd:'123456', group:4, privillege:User.privillege.admin | User.privillege.manager});
		User.db.replace(u);
	}


}

test();