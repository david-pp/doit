var redis = require('./db')

function User (user) {
	this.id = user.id;
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

User.prototype.keyname = function () {
	return 'u:' + this.id;
}

User.prototype.save = function() {
	redis.hset(this.keyname(), 'name', this.name);
	redis.hset(this.keyname(), 'password', this.password);
}

User.get = function (id) {
	redis.exists('u:' + id, function(err, res) {
		console.log(res);
	});
}

User.authenticate = function (name, pass, fn) {

	redis.hget('u:' + name, 'password', function(err, res){
		if (res && res == pass)
		{
			redis.hgetall('u:' + name, function(err, res) {
				fn(null, new User(res));
			})
		}
		else
		{
			fn(new Error('用户名或密码错误！'))
		}
	});
}