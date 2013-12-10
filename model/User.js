var Util = require('util');
var mysql = require('../db');


var meta = {
	table: 'user',
	key:'id',
	auto_increment : true,
	fields: [
		{ name:'id', type:'int(10)', default: 0},
		{ name:'name', type:'varchar(32)', default: ''},
		{ name:'group', type:'int(10)', default: 0}
	]
};

function DBHelper(meta) {
	this.meta_ =  meta;

	console.log(meta);

	this.makeField = function(f) {
		var sql = '`' + f.name + '` ' + f.type + ' NOT NULL';

		if (this.meta_.key == f.name && this.meta_.auto_increment)
		{
			sql += ' auto_increment';
		}
		else
		{
			sql += ' DEFAULT ';

			if (typeof f.default == 'string') 
				sql += '\'' + f.default  + '\'';
			else
				sql += f.default;
		}

		return sql;
	}

	this.makeTableName = function() {
		return '`' + this.meta_.table + '`';
	}

	this.checkValid = function (obj) {
		for (var attr in obj) {
			if (typeof attr == 'string' || typeof attr == 'number') {
				var isexist = false;
				for (var i = 0; i < this.meta_.fields.length; i++) {
					if (this.meta_.fields[i].name == attr) {
						isexist = true;
						break;
					}
				}

				if (!isexist)
					return false;
			}
		}
		return true;
	}
}

DBHelper.prototype.createTable = function() {

	var sql = 'CREATE TABLE '+ this.makeTableName() + ' (';
	for (var i = 0; i < this.meta_.fields.length; i++)
	{
		var f = this.meta_.fields[i];
		sql += this.makeField(f);

		if (i < this.meta_.fields.length-1)
			sql += ',';
	}

	if (this.meta_.key) {
		sql += ', PRIMARY KEY (`' + this.meta_.key +'`)';
	}

	sql += ')';

	console.log(sql);

	mysql.query(sql, function(err, results) {
		if (err) 
			console.log(err);
		else
			console.log(results);
	});
}

DBHelper.prototype.alterTable = function() {

	for (var i = 0; i < this.meta_.fields.length; i++) {
		var f = this.meta_.fields[i];
		var sql = 'ALTER TABLE ' + this.makeTableName() + ' ADD ' + this.makeField(f);
		
		console.log(sql);

		mysql.query(sql, function(err, results) {
		if (err) 
			console.log(err);
		else
			console.log(results);
		});
	}
}

DBHelper.prototype.insert = function(obj, fn) {
	if (!this.checkValid(obj)) {
		console.log('invalid....');
		return false;
	}

	mysql.query('INSERT INTO ' + this.makeTableName()  + 'SET ?', obj, function(err, results) {
		if (err) 
			console.log(err);
		else
			console.log(results);
	});
}

DBHelper.prototype.replace = function(obj) {
	if (!this.checkValid(obj)) {
		console.log('invalid....');
		return false;
	}

	mysql.query('REPLACE ' + this.makeTableName()  + 'SET ?', obj, function(err, results) {
		if (err) 
			console.log(err);
		else
			console.log(results);
	});

}

DBHelper.prototype.load = function(where, order, group) {
}

DBHelper.prototype.loadByKey = function(keyvalue) {
} 

DBHelper.prototype.delete = function(keyvalue) {
}


/*

helper = new DBHelper(meta);


helper.createTable();
helper.alterTable();
helper.insert({id:1, name:'王'});
helper.replace({id:1, name:'david', group:2});
helper.replace({id:2, name:'david', group:2});
helper.replace({name:'王22', group:2});
*/

function User(properties) {
	this.db = new DBHelper({
		table: 'user',
		key:'id',
		auto_increment : true,
		fields: [
			{ name:'id', type:'int(10)', default: 0},
			{ name:'name', type:'varchar(32)', default: ''},
			{ name:'group', type:'int(10)', default: 0}
		]
	});
}



var u = new User();


//Util.inherits(User, Model);
