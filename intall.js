

var User = require('./model/User.js')
var Task = require('./model/Task.js')

User.db.createTable();
User.db.alterTable();

Task.db.createTable();
Task.db.alterTable();


var names = ['王同学', '程同学', '林同学', '廖同学', '范同学', '陈同学', '江同学'];

function randomDate()
{
	var date = new Date();
	return date.getTime()/1000 + parseInt(Math.random() * 1000000);
}

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

	for (var i = 0; i < 100; i++) {
		var t = new Task({id:i, desc:'任务任务...........aaaaaaaaaaaaaa'+i, 
			category:parseInt(Math.random() * 6), 
			priority:parseInt(Math.random() * 5),
			status:parseInt(Math.random() * 7), 
			designer:names[parseInt(Math.random() * 7)], 
			client:names[parseInt(Math.random() * 7)], 
			server:names[parseInt(Math.random() * 7)],
			qa:names[parseInt(Math.random() * 7)],
			createtime:(new Date()).getTime()/1000,
			plan_servertime:randomDate(),
			plan_cotesttime:randomDate(),
			plan_qatesttime:randomDate()
		});
		Task.db.replace(t);
	}
}

test();