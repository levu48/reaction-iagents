var nools = require("nools");

var Message = function (message) {
	this.text = message;
};

var flow = nools.compile(__dirname + "/hello.nools");
var Message = flow.getDefined("Message");

/*
var flow = nools.flow("Hello World", function(flow) {
	flow.rule("Hello", [Message, "m", "m.text =~ /^hello\\sworld$/"], function(facts) {
		facts.m.text = facts.m.text + " goodbye";
		this.modify(facts.m);
	});

	flow.rule("Goodbye", [Message, "m", "m.text =~ /.*goodbye$/"], function(facts) {
		console.log(facts.m.text);
	});
});
*/

console.log("START");
var session = flow.getSession();
console.log("SESSION: " + session);
session.assert(new Message("hello world"));
console.log("FACTS: " + session.getFacts());
session.match();