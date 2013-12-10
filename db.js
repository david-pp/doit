var mysql      = require('mysql');
var config     = require('./config');

var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_passwd,
  database : config.mysql_db,
});

connection.connect(function(err) {
	console.log('mysql ....')
  // connected! (unless `err` is set)
});

module.exports = connection;