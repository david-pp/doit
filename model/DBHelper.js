var Util = require('util');
var mysql = require('../db');

module.exports = DBHelper;

function DBHelper(meta) {
	this.meta_ =  meta;

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

DBHelper.errorFunc = function(err, results) {
	if (err)
		console.log('[ERROR] %s', err.message);
	else
		console.log('[OK] %s', this.sql);
}


DBHelper.prototype.createTable = function(fn) {

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

	var cb = (typeof fn == 'undefined'  ?  DBHelper.errorFunc : fn);
	cb.sql = sql;
	mysql.query(sql, cb);
}

DBHelper.prototype.alterTable = function(fn) {

	for (var i = 0; i < this.meta_.fields.length; i++) {
		var f = this.meta_.fields[i];
		var sql = 'ALTER TABLE ' + this.makeTableName() + ' ADD ' + this.makeField(f);

		var cb = (typeof fn == 'undefined'  ?  DBHelper.errorFunc : fn);
		cb.sql = sql;
		mysql.query(sql, cb);
	}
}

DBHelper.prototype.insert = function(obj, fn) {

	var cb = (typeof fn == 'undefined' ?  DBHelper.errorFunc : fn);

	if (!this.checkValid(obj)) {
		cb(new Error('Insert : invalid object:' + Util.inspect(obj)));
		return false;
	}

	cb.sql = 'INSERT INTO ' + this.makeTableName()  + ' SET ?' + obj;
	mysql.query('INSERT INTO ' + this.makeTableName()  + ' SET ?', obj, cb);
}

DBHelper.prototype.replace = function(obj, fn) {
	var cb = (typeof fn == 'undefined' ?  DBHelper.errorFunc : fn);

	if (!this.checkValid(obj)) {
		cb(new Error('replace : invalid object:' + Util.inspect(obj)));
		return false;
	}

	cb.sql = 'REPLACE ' + this.makeTableName()  + ' SET ?' +  obj;
	mysql.query('REPLACE ' + this.makeTableName()  + ' SET ?', obj, cb);

}

DBHelper.prototype.select = function(columns, clouse, fn) {
	var sql = 'SELECT';
	if (columns)
		sql += ' ?? ';
	else
		sql += ' * ';
	sql += 'FROM ' + this.makeTableName();

	if (clouse)
		sql += ' ' + clouse;
	
	mysql.query(sql, [columns], fn);
}

DBHelper.prototype.loadWhere = function(where, fn) {
	this.select(0, 'WHERE ' + where, fn);
}

DBHelper.prototype.loadWhereOrder = function(where, order, fn) {
	var clouse = '';
	if (where)
		clouse += 'WHERE ' + where;
	if (order)
		clouse += 'ORDER BY ' + order;

	this.select(0, clouse , fn);
}

DBHelper.prototype.loadByKey = function(keyvalue, fn) {
	this.select(0, 'WHERE ' + this.meta_.key + ' = ' + keyvalue, fn);
} 

DBHelper.prototype.delete = function(where, fn) {
	var sql = 'DELETE FROM ' + this.makeTableName();

	if (typeof where != 'undefined' && where) {
		sql += '  WHERE ' + where;
	}

	var cb = (typeof fn == 'undefined' ?  DBHelper.errorFunc : fn);
	cb.sql = sql;
	mysql.query(sql, fn);
}

function test() {
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

	var helper = new DBHelper(meta);

	helper.createTable();
	helper.alterTable();
	helper.insert({id:1, name:'王', aa:'aaaaaa'});
	helper.replace({id:1, name:'david', group:2});
	helper.replace({name:'王22', group:2});

	helper.select(null, null, function(err, results) {
		console.log(err);
		console.log(results);
	});

	helper.select(['name', 'group'], null, function(err, results) {
		console.log(err);
		console.log(results);
	});

	helper.select(['id', 'name', 'group'], 'where id >= 10', function(err, results) {
		console.log(err);
		console.log(results);
	});

	helper.delete('id=1');

	helper.loadWhere('id >= 10', function(err, results) {
		console.log(this.sql);
		console.log(results);
	})

	helper.loadByKey(22, function(err, results) {
		console.log(this.sql);
		console.log(results);
	});
}

//test();