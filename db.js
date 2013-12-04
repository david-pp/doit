var redis = require('redis');

var redis_cli = null; 

if (redis_cli == null) {

	redis_cli = redis.createClient();

	redis_cli.on("error", function (err) {
		console.log("error event - " + redis_cli.host + ":" + redis_cli.port + " - " + err);
	});
}

module.exports = redis_cli;