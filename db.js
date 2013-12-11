var mysql      = require('mysql');
var config     = require('./config');

var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_passwd,
  database : config.mysql_db,
});

connection.connect(function(err) {
	if (err)
	{
		console.log(err);
	}
	else
	{
		console.log("mysql://%s:%s@%s:%s", 
			connection.config.user,
			connection.config.password,
			connection.config.host, 
			connection.config.port);
	}
});

module.exports = connection;