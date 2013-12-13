

var User = require('./model/User.js')
var Task = require('./model/Task.js')

User.db.createTable();
User.db.alterTable();

Task.db.createTable();
Task.db.alterTable();
