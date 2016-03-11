var nools = require("nools");

var Message = function (message) {
	this.text = message;
};

var flow = nools.compile(__dirname + "/goals.nools");
var Message = flow.getDefined("Message");


console.log("START");
var session = flow.getSession();

session.on("assert", function(fact) {
	console.log("ASSERT: " + fact.text);
});

session.on("fire", function(name, rule) {
	console.log("RULE: " + name + ", " + rule);
});

//session.assert(new Message("hello world"));
//session.match();

exports.session = session;
exports.Message = function(message) {
	return new Message(message);
};