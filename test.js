

function SayHello(prefix) {
	console.log(prefix + ' :' + this.name);
}

object = new Object();
object.name = 'david';

SayHello.call(object, 'Hello');
SayHello.apply(object, ['Hello2']);
SayHello('SayHello');


function Base(id) {
	this.id = id;
}

Base.prototype.printID = function() {
	console.log('printID:' + this.id);
};

Base.prototype.overload = function() {
	console.log('Base.overload');
};

function Dervied(id, name) {
	this.name = name;
	Base.call(this, id);
}

Dervied.prototype = new Base;

Dervied.prototype.printName = function() {
	console.log('printName:' + this.name);
}

Dervied.prototype.overload = function() {
	console.log('Dervied.overload');
}


b = new Base(10);

b.printID();
b.overload();

d = new Dervied(10, 'david');
d.printID();
d.printName();
d.overload();

console.log(parseInt(Math.random() * 10 + 1));